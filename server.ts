import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import mammoth from "mammoth";
import * as dotenv from "dotenv";

dotenv.config();

// Lazy initialize GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Simple logger middleware
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

// Increase payload size limit for base64 file uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Helper to safely parse JSON responses, stripping potential markdown blocks
function safeJsonParse(text: string | undefined | null): any {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error(`JSON Parsing failed. Text length: ${text.length}. Sample: ${cleaned.substring(0, 100)}...`);
    throw e;
  }
}

// Dynamic safe parsing helper for PDF
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid node execution crashes on specific systems
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
    });
    
    const pdf = await loadingTask.promise;
    let text = "";
    
    // Read up to 8 pages to avoid excessive token limits
    const maxPages = Math.min(pdf.numPages, 8);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || "")
        .join(" ");
      text += pageText + "\n";
    }
    return text.trim();
  } catch (err: any) {
    console.error("PDF reading error, falling back to regex: ", err);
    // Regex fallback to extract readable strings if pdfjs-dist encounters any library mismatches in node container
    const plainText = buffer.toString('binary').replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');
    const cleaned = plainText.match(/[a-zA-Z0-9\s\@\.\:\/\-\,\(\)\'\’\”\“\"]{4,100}/g);
    return cleaned ? cleaned.join("\n") : "Unable to parse text from binary. Please copy-paste the raw text.";
  }
}

// ----------------------------------------------------
// BACKEND API ROUTES
// ----------------------------------------------------

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// POST /api/resume/parse
// Extract plain text and transform it to structured JSON using Gemini
app.post("/api/resume/parse", async (req, res) => {
  try {
    const { fileBase64, fileName, fileType } = req.body;
    if (!fileBase64) {
      return res.status(400).json({ error: "No file content uploaded" });
    }

    const buffer = Buffer.from(fileBase64, "base64");
    let extractedText = "";

    // 1. Text extraction
    if (fileType === "txt" || fileName.endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else if (fileType === "docx" || fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (fileType === "pdf" || fileName.endsWith(".pdf")) {
      extractedText = await extractPdfText(buffer);
    } else {
      // Fallback fallback: try UTF-8 read
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({ error: "Could not extract any content from the file." });
    }

    // 2. Map structure using Gemini API
    const ai = getGeminiClient();
    const prompt = `You are an expert AI Resume Parser. Extract values from the resume context text provided below and format them perfectly into a highly detailed and completed structured resume data JSON according to the schema. 
Any elements like skills, experiences, languages, projects, education must have unique stable ids (e.g. use small alphanumeric values or hashes like 'exp1', 'proj1', etc.).
Generate a cohesive professional summary if none is defined, and structure elements clearly. Determine category of skills (e.g., Frontend, Backend, Tools) based on the skill name. Determine best dates where available.

Resume Text Content:
---
${extractedText}
---`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            templateId: { type: Type.STRING, description: "Default to 'modern'" },
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                website: { type: Type.STRING },
                github: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                jobTitle: { type: Type.STRING }
              }
            },
            summary: { type: Type.STRING, description: "Professional summary of the applicant" },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: { type: Type.STRING, description: "Detailed summary of duties, bullet points, outcomes as a single string" }
                }
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  grade: { type: Type.STRING }
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  level: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Category of the skill e.g. Frontend, Backend, Database, Cloud, Soft Skills, Design" }
                }
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                  link: { type: Type.STRING }
                }
              }
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  proficiency: { type: Type.STRING }
                }
              }
            },
            achievements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  date: { type: Type.STRING }
                }
              }
            },
            customSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const parsedJson = safeJsonParse(response.text);
    res.json({
      success: true,
      rawText: extractedText,
      resumeData: parsedJson
    });
  } catch (error: any) {
    console.error("Parse endpoint error: ", error);
    res.status(500).json({ error: error.message || "Failed to parse resume" });
  }
});

// POST /api/resume/improve
// Perform AI resume improvement (can improve summary, professional rewrites, or the complete resume body)
app.post("/api/resume/improve", async (req, res) => {
  try {
    const { resumeData, focusArea } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "No resume data provided" });
    }

    const ai = getGeminiClient();
    const prompt = `You are an expert resume writer and career expert. 
Review and completely optimize the provided Resume ResumeData content, rewrite summary, re-elaborate experiences with high-impact action verbs, correct grammar, and make sentences ATS-friendly. 
Keep matching fields consistent but polish content. Give items strong quantitative metrics if applicable.
Return the optimized ResumeData object strictly as valid JSON structure matching the schema.

Focus Area / Action Requested: ${focusArea || "Improve Entire Resume"}

Current Resume Content:
${JSON.stringify(resumeData, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            templateId: { type: Type.STRING },
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                website: { type: Type.STRING },
                github: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                jobTitle: { type: Type.STRING }
              }
            },
            summary: { type: Type.STRING },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: { type: Type.STRING }
                }
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  grade: { type: Type.STRING }
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  level: { type: Type.STRING },
                  category: { type: Type.STRING }
                }
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                  link: { type: Type.STRING }
                }
              }
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  proficiency: { type: Type.STRING }
                }
              }
            },
            achievements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  date: { type: Type.STRING }
                }
              }
            },
            customSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const parsedJson = safeJsonParse(response.text);
    res.json({ success: true, improvedResume: parsedJson });
  } catch (error: any) {
    console.error("Improve endpoint error: ", error);
    res.status(500).json({ error: error.message || "Failed to optimize resume." });
  }
});

// POST /api/resume/ats-score
// Evaluate resume strength and potential issues
app.post("/api/resume/ats-score", async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "No resume data provided" });
    }

    const ai = getGeminiClient();
    const prompt = `You are an ATS (Applicant Tracking System) parser and experienced HR manager. 
Analyze the resume content listed below and output an JSON ATS report details including a numerical rating (score between 1 and 100), key grammar corrections, potential missing keywords for their target job title (${resumeData.personalInfo?.jobTitle || "the applicant's targeted field"}), strong highlights/positives, core metrics improvements, and a list of recommended skills.

Resume data for assessment:
${JSON.stringify(resumeData, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Numerical score from 1 to 100 representing resume strength and ATS compatibility" },
            grammarIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific grammar or punctuation issues/suggestions" },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vital industry/role keywords that would help clear parsers" },
            positives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strong highlights and achievements detected" },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detailed, actionable points to raise the score" },
            recommendedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested software, technical or soft skills that match this role" }
          },
          required: ["score", "grammarIssues", "missingKeywords", "positives", "improvements", "recommendedSkills"]
        }
      }
    });

    const parsedReport = safeJsonParse(response.text);
    res.json({ success: true, report: parsedReport });
  } catch (error: any) {
    console.error("ATS Report endpoint error: ", error);
    res.status(500).json({ error: error.message || "Failed to analyze score." });
  }
});

// POST /api/resume/keyword-match
// Checks resume items against a pasted job description
app.post("/api/resume/keyword-match", async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "Both resumeData and jobDescription are required" });
    }

    const ai = getGeminiClient();
    const prompt = `Evaluate the resume compatibility against the job description provided below. 
Generate a JSON report including a matchPercentage (0 - 100), list of matching keywords, list of missing vital keywords found in the JD, bullets detailing role relevance analysis, and critical focus areas.

Job Description:
${jobDescription}

Resume:
${JSON.stringify(resumeData, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchPercentage: { type: Type.INTEGER },
            matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            evaluationSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
            roleRelevance: { type: Type.STRING }
          },
          required: ["matchPercentage", "matchedKeywords", "missingKeywords", "evaluationSummary", "roleRelevance"]
        }
      }
    });

    const parsedReport = safeJsonParse(response.text);
    res.json({ success: true, report: parsedReport });
  } catch (error: any) {
    console.error("Keyword match error: ", error);
    res.status(500).json({ error: error.message || "Failed to match keywords." });
  }
});

// POST /api/resume/ai-suggestions
// Give section/role auto suggestions dynamically
app.post("/api/resume/ai-suggestions", async (req, res) => {
  try {
    const { jobTitle, sectionName, currentText } = req.body;
    const ai = getGeminiClient();
    
    const prompt = `You are an elite career development assistant. Under section "${sectionName || "Experience"}" for target job title "${jobTitle || "Software Engineer"}", provide a professional rewrite, actionable bullets, and ATS optimization suggestions.
Current text: "${currentText || ""}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 2048,
      }
    });

    res.json({ success: true, suggestions: response.text });
  } catch (error: any) {
    console.error("AI suggestions error: ", error);
    res.status(500).json({ error: error.message || "Failed to generate suggestions." });
  }
});

// POST /api/resume/chat
// Dedicated assistant chat to discuss resume improvements, brainstorm, cover letters, mock prep
app.post("/api/resume/chat", async (req, res) => {
  try {
    const { messages, resumeData } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    
    // Construct the context
    const contextPrompt = `You are a helpful Career Buddy & Intelligent AI Resume Assistant. 
You possess full context of the applicant's current resume, detailed below on how to help them format, enhance, answers questions, prepare interview questions, or craft bullet points. 
Give actionable, human-like answers. Keep it brief and friendly.

Applicant's Current Resume Context:
${JSON.stringify(resumeData || {}, null, 2)}
`;

    // Map conversation for general chat parameters
    const mappedContents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Inject system context instructions as module system configuration
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: mappedContents,
      config: {
        systemInstruction: contextPrompt,
        maxOutputTokens: 4096,
      }
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("Chat endpoint error: ", error);
    res.status(500).json({ error: error.message || "Assistant failed to generate response." });
  }
});

// POST /api/resume/create
// Simple placeholder to format/save files if required or return structured info
app.post("/api/resume/create", (req, res) => {
  const { resumeData } = req.body;
  res.json({ success: true, message: "Resume format verified", resumeData });
});

// ----------------------------------------------------
// VITE OR STATIC FILE SERVING MIDDLEWARE & SERVER START
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to host 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Core backend service running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start full-stack server:", err);
  });
}

export default app;
