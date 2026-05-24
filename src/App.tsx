import React, { useState, useEffect } from "react";
import { ResumeData, ATSReport, KeywordMatchReport, VersionInfo } from "./types";
import { ResumeForm } from "./components/ResumeForm";
import { ResumePreview } from "./components/ResumePreview";
import { ATSScoreReport } from "./components/ATSScoreReport";
import { AIAssistantChat } from "./components/AIAssistantChat";
import {
  FileText, Upload, Sparkles, Plus, Trash2, ArrowRight, Sun, Moon, Database, HelpCircle,
  RefreshCw, CheckCircle, Award, Compass, Heart, Bookmark, Undo2, ArrowLeftRight, Check,
  Lightbulb, ArrowDownToLine, HelpCircle as HelpIcon, PlayCircle,
  Linkedin, Twitter, Github
} from "lucide-react";
// @ts-ignore
import logoImg from "../images/logo.png";

// Default/mock initial data to start clean in case localstorage is empty
const defaultResume: ResumeData = {
  templateId: "modern",
  personalInfo: {
    fullName: "chetan janjalkar",
    email: "chetan.babura@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "https://chetanjanjalkar.github.io",
    github: "github.com/Chetanjanjalkar791",
    linkedin: "linkedin.com/in/chetan-janjalkar-2a92a432b/",
    jobTitle: "Senior TypeScript Full-Stack Developer",
  },
  summary: "Results-driven Full-Stack Engineer with 5+ years of experience specializing in TypeScript, React, and Node.js. Passionate about engineering high-throughput server backends and crafting high-fidelity interactive user experiences. Strong track record of accelerating product shipping speeds and raising ATS compatibility.",
  experiences: [
    {
      id: "exp_1",
      company: "InnoTech Solutions",
      position: "Lead Full-Stack Developer",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      description: "- Designed and deployed secure microservice architectures driving 12+ enterprise SaaS portals.\n- Coordinated with product designers to reduce client-side loading times by 32% using React Concurrent rendering.\n- Established a rigorous CI/CD pipelining protocol that trimmed production environment hotfixes by 40%."
    },
    {
      id: "exp_2",
      company: "ByteForce Logistics",
      position: "Software Engineer",
      startDate: "Mar 2020",
      endDate: "Dec 2021",
      current: false,
      description: "- Spearheaded the optimization of SQL database triggers, achieving a 15% boost in search queries.\n- Drafted, audited, and maintained comprehensive end-to-end unit tests using Jest, raising coverage metrics from 60% to 92%.\n- Integrated multiple third-party payments gateways (Stripe, Paypal) with clean logging protocols."
    }
  ],
  projects: [
    {
      id: "proj_1",
      name: "Smart Resume Builder Core API",
      role: "Creator & Architect",
      startDate: "Jan 2024",
      endDate: "Mar 2024",
      description: "Developed a secure full-stack platform utilizing Node.js Express server to parse multi-format documents and generate structured JSON entities via advanced AI models.",
      link: "github.com/Chetanjanjalkar791/DCResume-ai"
    }
  ],
  education: [
    {
      id: "edu_1",
      school: "Stanford University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "Sep 2016",
      endDate: "Jun 2020",
      grade: "3.85 / 4.0"
    }
  ],
  skills: [
    { id: "s1", name: "TypeScript", level: "Expert", category: "Languages" },
    { id: "s2", name: "React.js", level: "Expert", category: "Libraries" },
    { id: "s3", name: "Node.js (Express)", level: "Expert", category: "Backend" },
    { id: "s4", name: "PostgreSQL", level: "Intermediate", category: "Database" },
    { id: "s5", name: "AI API Integration", level: "Expert", category: "AI Tools" },
    { id: "s6", name: "Tailwind CSS", level: "Expert", category: "Design" }
  ],
  certifications: [
    { id: "c1", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "Nov 2023", link: "" }
  ],
  languages: [
    { id: "l1", name: "English", proficiency: "Native" },
    { id: "l2", name: "Spanish", proficiency: "Conversational" }
  ],
  achievements: [
    { id: "a1", title: "TechCon Hackathon — First Place out of 150 competitors", description: "Created an automated emergency dispatch coordination layout with Google Maps under 36 hours.", date: "Spring 2023" }
  ],
  customSections: []
};

export default function App() {
  // App routing flow states: "home" | "select-flow" | "create" | "upload" | "dashboard" | "about"
  const [activeFlow, setActiveFlow] = useState<"home" | "select-flow" | "create" | "upload" | "dashboard" | "about">("home");
  const [activeSubTab, setActiveSubTab] = useState<"editor" | "ats" | "copilot" | "compare" | "mock">("editor");

  const [resumeData, setResumeData] = useState<ResumeData>(defaultResume);

  // Before vs After data comparison support
  const [beforeResumeData, setBeforeResumeData] = useState<ResumeData | null>(null);

  // States
  const [templateId, setTemplateId] = useState<string>("modern");
  const [darkTheme, setDarkTheme] = useState<boolean>(() => {
    document.documentElement.classList.remove("dark");
    return false;
  });
  const [resumeVersions, setResumeVersions] = useState<VersionInfo[]>([]);
  const [faqOpen, setFaqOpen] = useState<boolean>(false);
  const faqTimeoutRef = React.useRef<any>(null);

  const handleFAQMouseEnter = () => {
    if (faqTimeoutRef.current) {
      clearTimeout(faqTimeoutRef.current);
      faqTimeoutRef.current = null;
    }
    setFaqOpen(true);
  };

  const handleFAQMouseLeave = () => {
    faqTimeoutRef.current = setTimeout(() => {
      setFaqOpen(false);
    }, 200);
  };

  // AI loading and payload responses
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [parsingLoading, setParsingLoading] = useState<boolean>(false);
  const [atsScoreLoading, setAtsScoreLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const [atsReport, setAtsReport] = useState<ATSReport | null>(null);
  const [keywordReport, setKeywordReport] = useState<KeywordMatchReport | null>(null);
  const [keywordLoading, setKeywordLoading] = useState<boolean>(false);

  // Instant messaging state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: "user" | "model"; text: string }>>([]);

  // Auto-scanning simulation text inside uploaded flow
  const [scanningStatus, setScanningStatus] = useState<string>("");

  // Ref for background style injection (simplified)
  const bgContainerRef = React.useRef<HTMLDivElement>(null);

  // Set theme globally on mount
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem("smart_resume_dark", "false");
    } catch (e) { }
  }, []);


  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem("smart_resume_data");
      const savedBefore = localStorage.getItem("smart_resume_before_data");
      const savedVersions = localStorage.getItem("smart_resume_versions");
      const savedTemplate = localStorage.getItem("smart_resume_template");

      if (savedResume) {
        setResumeData(JSON.parse(savedResume));
      }
      if (savedBefore) {
        setBeforeResumeData(JSON.parse(savedBefore));
      }
      if (savedVersions) {
        setResumeVersions(JSON.parse(savedVersions));
      }
      if (savedTemplate) {
        setTemplateId(savedTemplate);
      }
    } catch (err) {
      console.error("Localstorage recovery failed: ", err);
    }
  }, []);

  // Save state back to LocalStorage automatically (Auto Save)
  useEffect(() => {
    try {
      localStorage.setItem("smart_resume_data", JSON.stringify(resumeData));
      localStorage.setItem("smart_resume_template", templateId);
    } catch (err) {
      console.error("Autosave state failure: ", err);
    }
  }, [resumeData, templateId]);

  const toggleTheme = () => {
    const nextTheme = !darkTheme;
    setDarkTheme(nextTheme);
    localStorage.setItem("smart_resume_dark", String(nextTheme));
    if (nextTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Safe file loader helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setParsingLoading(true);
    setScanningStatus(`Reading local file block: "${file.name}"...`);

    try {
      const reader = new FileReader();

      // Promisify the file reader
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = (event) => {
          const result = event.target?.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      setScanningStatus("Initiating server-side optical scanning & text extractor...");

      // Make API call to backend parse route
      const response = await fetch("/api/resume/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: base64Data,
          fileName: file.name,
          fileType: file.name.split(".").pop(),
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Parsing failed on servers.");
      }

      setScanningStatus("Context mapping structures with AI matching guidelines...");
      const payload = await response.json();

      if (payload.success && payload.resumeData) {
        const parsedResume = payload.resumeData;
        parsedResume.templateId = "modern";

        // Record the uploaded data as 'Before' so we can do Before-vs-After comparison!
        setBeforeResumeData(parsedResume);
        localStorage.setItem("smart_resume_before_data", JSON.stringify(parsedResume));

        // Update active resume
        setResumeData(parsedResume);

        // Push initial snapshot of backup states
        addVersionSnapshot("Initial Parse from PDF/Document Backup", parsedResume);

        // Transition to editor layout
        setScanningStatus("Resume ready! Directing to workspace...");
        setTimeout(() => {
          setActiveFlow("dashboard");
          setActiveSubTab("editor");
          setParsingLoading(false);
        }, 1000);
      } else {
        throw new Error("Could not parse file data schema.");
      }

    } catch (err: any) {
      console.error(err);
      alert(`Parsing issue: ${err.message || 'Check your internet or file content formatting'}`);
      setParsingLoading(false);
    }
  };

  // Creates branch history configurations
  const addVersionSnapshot = (labelString: string, dataObj = resumeData) => {
    const newVer: VersionInfo = {
      id: "v_" + Date.now(),
      timestamp: new Date().toLocaleTimeString() + " (" + new Date().toLocaleDateString() + ")",
      label: labelString,
      resumeData: JSON.parse(JSON.stringify(dataObj))
    };
    const updated = [newVer, ...resumeVersions];
    setResumeVersions(updated);
    localStorage.setItem("smart_resume_versions", JSON.stringify(updated));
  };

  const deleteVersion = (verId: string) => {
    const updated = resumeVersions.filter(v => v.id !== verId);
    setResumeVersions(updated);
    localStorage.setItem("smart_resume_versions", JSON.stringify(updated));
  };

  const revertToVersion = (version: VersionInfo) => {
    // Keep a backup of current edit before revert just in case
    addVersionSnapshot(`Auto Backup before restoring [${version.label}]`);
    setResumeData(version.resumeData);
  };

  // AI Assistant triggers
  const handleAIAction = async (type: "summary" | "experience" | "project" | "skills" | "improveAll", sectionId?: string) => {
    setAiLoading(true);
    try {
      if (type === "summary") {
        const response = await fetch("/api/resume/ai-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: resumeData.personalInfo?.jobTitle || "Software Engineer",
            sectionName: "Professional Career Overview Summary",
            currentText: resumeData.summary || ""
          })
        });
        const payload = await response.json();
        if (payload.success && payload.suggestions) {
          // Clean model headers, replace current
          const cleanTxt = payload.suggestions.replace(/```(markdown|json)?/g, "").replace(/```/g, "").trim();

          addVersionSnapshot("AI generated professional summary revision");
          setResumeData({
            ...resumeData,
            summary: cleanTxt
          });
        }
      } else if (type === "experience" && sectionId) {
        const expItem = resumeData.experiences.find(x => x.id === sectionId);
        if (!expItem) return;

        const response = await fetch("/api/resume/ai-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: resumeData.personalInfo?.jobTitle || "Software Engineer",
            sectionName: "Job Work Experience Achievements and Metrics",
            currentText: expItem.description || ""
          })
        });
        const payload = await response.json();
        if (payload.success && payload.suggestions) {
          const cleanTxt = payload.suggestions.replace(/```(markdown|json)?/g, "").replace(/```/g, "").trim();
          addVersionSnapshot(`AI Optimized Job Bullet Highlights: ${expItem.company}`);

          const updatedExps = resumeData.experiences.map(x => {
            if (x.id === sectionId) {
              return { ...x, description: cleanTxt };
            }
            return x;
          });
          setResumeData({ ...resumeData, experiences: updatedExps });
        }
      } else if (type === "project" && sectionId) {
        const projItem = resumeData.projects?.find(x => x.id === sectionId);
        if (!projItem) return;

        const response = await fetch("/api/resume/ai-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: resumeData.personalInfo?.jobTitle || "Engineer",
            sectionName: "High Impact Project Description",
            currentText: projItem.description || ""
          })
        });
        const payload = await response.json();
        if (payload.success && payload.suggestions) {
          const cleanTxt = payload.suggestions.replace(/```(markdown|json)?/g, "").replace(/```/g, "").trim();
          addVersionSnapshot(`AI Optimized Project descriptions: ${projItem.name}`);

          const updatedProjs = resumeData.projects?.map(x => {
            if (x.id === sectionId) {
              return { ...x, description: cleanTxt };
            }
            return x;
          });
          setResumeData({ ...resumeData, projects: updatedProjs });
        }
      } else if (type === "improveAll") {
        const response = await fetch("/api/resume/improve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeData: resumeData,
            focusArea: "Improve entire structure with unified metrics and quantitative values for job descriptions"
          })
        });
        const payload = await response.json();
        if (payload.success && payload.improvedResume) {
          addVersionSnapshot("One-click complete professional AI rewrite");
          setResumeData(payload.improvedResume);
        }
      }
    } catch (err) {
      console.error(err);
      alert("AI improvement route failed. Check server connection or variables.");
    } finally {
      setAiLoading(false);
    }
  };

  // Pulls full detailed ATS report
  const handleAnalyzeATSScore = async () => {
    setAtsScoreLoading(true);
    try {
      const response = await fetch("/api/resume/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData })
      });
      const payload = await response.json();
      if (payload.success && payload.report) {
        setAtsReport(payload.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAtsScoreLoading(false);
    }
  };

  // Job matching
  const handleKeywordAnalyze = async (jobDesc: string) => {
    setKeywordLoading(true);
    try {
      const response = await fetch("/api/resume/keyword-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, jobDescription: jobDesc })
      });
      const payload = await response.json();
      if (payload.success && payload.report) {
        setKeywordReport(payload.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setKeywordLoading(false);
    }
  };

  // Conversational buddy sending message
  const handleSendChatMessage = async (inpText: string) => {
    const userMsg = { id: Math.random().toString(), role: "user" as const, text: inpText };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await fetch("/api/resume/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          resumeData: resumeData
        })
      });
      const payload = await response.json();
      if (payload.success && payload.reply) {
        setChatMessages(prev => [
          ...prev,
          { id: Math.random().toString(), role: "model" as const, text: payload.reply }
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        { id: Math.random().toString(), role: "model" as const, text: "Ah, copilot ran into a connecting error. Please make sure the backend is active." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Dynamic strength meter percentage
  const calculateLocalStrength = () => {
    let score = 20;
    if (resumeData.personalInfo?.fullName) score += 10;
    if (resumeData.personalInfo?.email) score += 10;
    if (resumeData.personalInfo?.phone) score += 5;
    if (resumeData.personalInfo?.location) score += 5;
    if (resumeData.summary) score += 10;
    if (resumeData.experiences && resumeData.experiences.length > 0) score += 20;
    if (resumeData.projects && resumeData.projects.length > 0) score += 105;
    if (resumeData.education && resumeData.education.length > 0) score += 10;
    if (resumeData.skills && resumeData.skills.length > 0) score += 10;
    return Math.min(score, 100);
  };

  // Export as backup layout
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resumeData.personalInfo?.fullName || "index"}_backup_resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo) {
          addVersionSnapshot("Backup Imported Revision");
          setResumeData(parsed);
          alert("Backup resume parsed successfully!");
        } else {
          alert("Invalid backup schema detected.");
        }
      } catch (err) {
        alert("Corrupted JSON backup file.");
      }
    };
    fileReader.readAsText(file);
  };

  // Auto trigger the first ATS scanner calculation on dashboard entrance
  useEffect(() => {
    if (activeFlow === "dashboard" && !atsReport) {
      handleAnalyzeATSScore();
    }
  }, [activeFlow]);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 flex flex-col relative transition-colors print:bg-white print:text-black print:min-h-0 print:block">
      {/* Premium Background Grid & Glow Overlay */}
      <div
        ref={bgContainerRef}
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden print:hidden"
        aria-hidden="true"
      >
        {/* Solid base color */}
        <div className="absolute inset-0 premium-bg-grid" />

        {/* Center Glowing Purple Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-600/12 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* ----------------- GLOBAL HEADER ----------------- */}
      <header className="sticky top-0 z-40 bg-[#080b13]/85 backdrop-blur-md border-b border-slate-850 px-6 py-4.5 print-hidden print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo brand */}
          <div
            onClick={() => setActiveFlow("home")}
            className="flex items-center cursor-pointer select-none group"
            title="Developer Chetan"
          >
            <div className="flex items-center gap-4.5">
              <img
                src={logoImg}
                className="w-11 h-11 object-contain select-none shrink-0 group-hover:scale-105 transition-transform"
                alt="Developer Chetan Logo"
              />
              <div className="flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-purple-500 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text text-2xl font-black tracking-wider font-space select-none">
                  RESUME
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-md font-mono select-none leading-none animate-blink-green">
                  AI
                </span>
              </div>
            </div>
          </div>

          {/* Navigation & Actions - Right aligned */}
          <div className="flex items-center gap-6">
            {/* Navigation options */}
            <nav className="flex items-center gap-2 text-slate-400">
              <button
                onClick={() => setActiveFlow("home")}
                className={`transition-all duration-200 text-[13px] font-sans ${activeFlow === "home"
                  ? "px-4.5 py-2 rounded-full text-purple-300 bg-purple-950/40 border border-purple-900/30 font-extrabold shadow-[0_0_15px_-3px_rgba(168,85,247,0.15)]"
                  : "px-4.5 py-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-900/60 font-bold"
                  }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveFlow("about")}
                className={`transition-all duration-200 text-[13px] font-sans ${activeFlow === "about"
                  ? "px-4.5 py-2 rounded-full text-purple-300 bg-purple-950/40 border border-purple-900/30 font-extrabold shadow-[0_0_15px_-3px_rgba(168,85,247,0.15)]"
                  : "px-4.5 py-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-900/60 font-bold"
                  }`}
              >
                About
              </button>
            </nav>

            {/* Action rails / Navigation CTA */}
            <div className="flex items-center gap-3">
              {(activeFlow === "home" || activeFlow === "about") && (
                <button
                  onClick={() => setActiveFlow("select-flow")}
                  className="px-5 py-2.5 text-[13px] font-black text-white bg-gradient-to-r from-purple-600 to-pink-650 hover:from-purple-500 hover:to-pink-550 rounded-full shadow-md hover:shadow-purple-500/25 transition-all hover:scale-[1.03] active:scale-[0.98] duration-200 font-sans"
                >
                  Start Free ⚡
                </button>
              )}

              {activeFlow === "select-flow" && (
                <button
                  onClick={() => setActiveFlow("home")}
                  className="px-4.5 py-2 text-[13px] font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors font-sans"
                >
                  Back to Home
                </button>
              )}

              {activeFlow === "dashboard" && (
                <button
                  onClick={() => setActiveFlow("home")}
                  className="hidden sm:flex items-center gap-1.5 px-4.5 py-2 text-[13px] font-bold text-slate-350 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors font-sans"
                >
                  <Undo2 size={13.5} />
                  <span>Exit Workspace</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ----------------- CORE PAGES & WORKFLOWS ----------------- */}
      <main className="flex-1 print:p-0 print:m-0 print:overflow-visible">
        {/* 1. BRAND NEW LANDING HOMEPAGE VIEW */}
        {activeFlow === "home" && (
          <div className="px-6 max-w-7xl mx-auto space-y-24">

            {/* Side-by-side Hero & Mockup Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-96px)] py-12 lg:py-6">
              {/* Left Side: Display Hero Intro */}
              <div className="lg:col-span-5 text-left space-y-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">
                  [ ⚡ No logins • No cap • Unlimited resume optimization ]
                </h2>
                <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-transparent bg-clip-text leading-tight italic">
                  Build Resumes That Actually Secure the Bag. <span className="inline-block hover:scale-115 hover:translate-x-1.5 hover:-translate-y-1.5 transition-transform duration-350 cursor-pointer">🚀</span>
                </h3>
                <p className="text-sm text-slate-350 font-sans leading-relaxed">
                  No credit cards. No database leaks. Just a local, high-fidelity AI sandbox designed to review your experience, optimize action bullets, and get you hired in minutes.
                </p>

                {/* Glowing CTA buttons */}
                <div className="pt-2 flex flex-col sm:flex-row justify-start items-center gap-4">
                  <button
                    onClick={() => setActiveFlow("select-flow")}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-650 hover:from-purple-500 hover:to-pink-550 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    Optimize Your Resume ⚡
                  </button>
                  <button
                    onClick={() => setActiveFlow("about")}
                    className="w-full sm:w-auto px-6 py-3 bg-transparent border border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all duration-300"
                  >
                    Read The Blueprint
                  </button>
                </div>
              </div>

              {/* Right Side: CSS Mockup of the Workspace */}
              <div className="lg:col-span-7 relative w-full bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-purple-500/30 shadow-2xl hover:shadow-purple-500/5 p-4 sm:p-6 overflow-hidden transition-all duration-500">
                {/* Window Controls */}
                <div className="flex items-center gap-1.5 pb-4 border-b border-slate-900">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] text-slate-500 font-mono ml-4">workspace_sandbox_v2.tsx</span>
                </div>

                {/* Side by side mockup grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 text-left">
                  {/* Left Side: Form Editor */}
                  <div className="md:col-span-5 space-y-3 opacity-90">
                    <div className="text-[10px] font-bold text-purple-400 font-mono uppercase">1. Edit Content Form</div>

                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <div className="text-[9px] font-bold text-slate-400">Full Name</div>
                        <div className="h-7 bg-slate-900 border border-slate-800 rounded px-2 text-[10px] text-slate-200 flex items-center">Chetan Janjalkar</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[9px] font-bold text-slate-400">Target job title</div>
                        <div className="h-7 bg-slate-900 border border-slate-800 rounded px-2 text-[10px] text-slate-200 flex items-center">Senior Full-Stack Developer</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[9px] font-bold text-slate-400">Summary</div>
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-400 leading-relaxed min-h-[60px]">
                          Results-driven Software Engineer with 5+ years of experience specializing in TypeScript, React, and Node.js...
                        </div>
                      </div>

                      {/* AI Button mockup */}
                      <div className="h-8 bg-purple-900/40 border border-purple-800/60 rounded flex items-center justify-center gap-1.5 text-[10px] font-bold text-purple-300">
                        <Sparkles size={11} className="text-purple-400 animate-pulse" />
                        <span>Polish Summary with AI</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Page Preview */}
                  <div className="md:col-span-7 bg-[#080b13] border border-slate-800/80 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[240px] sm:min-h-[280px] shadow-inner">
                    {/* Glowing ATS match badge floating */}
                    <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-500/50 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg shadow-emerald-500/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">94% ATS Match</span>
                    </div>

                    {/* Mock Resume Content */}
                    <div className="space-y-3.5">
                      {/* Header */}
                      <div className="space-y-1 border-b border-slate-900 pb-2">
                        <div className="w-24 h-3.5 bg-slate-800 rounded-sm" />
                        <div className="w-36 h-2 bg-slate-900 rounded-sm" />
                      </div>

                      {/* Content blocks */}
                      <div className="space-y-2">
                        <div className="w-16 h-2.5 bg-slate-800 rounded-sm" />
                        <div className="space-y-1.5">
                          <div className="w-full h-1.5 bg-slate-900 rounded-sm" />
                          <div className="w-5/6 h-1.5 bg-slate-900 rounded-sm" />
                          <div className="w-4/5 h-1.5 bg-slate-900 rounded-sm" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="w-12 h-2.5 bg-slate-800 rounded-sm" />
                        <div className="space-y-1.5">
                          <div className="w-11/12 h-1.5 bg-slate-900 rounded-sm" />
                          <div className="w-full h-1.5 bg-slate-900 rounded-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Vector PDF badge */}
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-900 text-[9px] text-slate-500">
                      <span>A4 Portrait Layout</span>
                      <span className="text-[8px] uppercase tracking-wider font-mono text-purple-400">PDF standard ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="flex flex-col items-center gap-1.5 justify-center print:hidden select-none animate-pulse pt-2 pb-6">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Scroll to explore</span>
              <div className="w-5 h-8 border border-slate-700 rounded-full flex items-start justify-center p-1 bg-slate-950/50 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
              </div>
            </div>

            {/* Why Hustlers Choose Us Features Grid */}
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">
                  WHY HUSTLERS CHOOSE US
                </h4>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-purple-300 to-white text-transparent bg-clip-text italic">
                  Advanced Platform Features ✨
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="bg-[#090b11] border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)] transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 bg-purple-950/40 text-purple-400 rounded-xl flex items-center justify-center border border-purple-900/40">
                    <Database size={18} />
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-sans font-space">Database-Free Privacy</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Zero cloud sync. All backup snapshot versions, details, and active selections write straight to your browser LocalStorage. No leaks, no drama.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#090b11] border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.2)] transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 bg-cyan-950/40 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-900/40">
                    <Award size={18} />
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-sans font-space">Real-time ATS Scoring</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Test your build against Applicant Tracking System parameters. Search for missing keywords and solve structural issues in real-time.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#090b11] border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)] transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 bg-pink-950/40 text-pink-400 rounded-xl flex items-center justify-center border border-pink-900/40">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-sans font-space">AI Bullet Optimizer</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Let the AI write summaries, optimize experience bullets, and run simulated mock interviews in a direct chat.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Conversion Banner Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#0d0f19] to-[#120e22] border border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-6">
              {/* background glows */}
              <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-pink-600/10 blur-[80px] pointer-events-none" />

              <div className="relative space-y-3 max-w-xl mx-auto">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-space italic">Ready to stop getting ghosted?</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  Join the job seekers optimizing their careers. No accounts, no subscriptions, completely free.
                </p>
              </div>

              <div className="relative pt-2">
                <button
                  onClick={() => setActiveFlow("select-flow")}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-550 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-[1.02] duration-300"
                >
                  Get Started for Free ⚡
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1.2 SELECT FLOW VIEW (Flow Selector Cards) */}
        {activeFlow === "select-flow" && (
          <div className="py-12 px-4 max-w-5xl mx-auto space-y-12">
            {/* Title Header */}
            <div className="text-center space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">
                [ DEFINE YOUR BUILDING METHOD ]
              </h2>
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-purple-300 to-white text-transparent bg-clip-text italic">
                Choose Your Pathway ✨
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-sans">
                Select your building experience to start. Store details in LocalStorage, parse multi-format documents, and optimize instantly.
              </p>
            </div>

            {/* Two Flows selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* FLOW 1: CREATE NEW RESUME */}
              <div
                onClick={() => {
                  setResumeData(defaultResume);
                  setActiveFlow("dashboard");
                  setActiveSubTab("editor");
                }}
                className="group relative bg-[#090b11] hover:bg-[#0d1222] border border-slate-800/80 hover:border-purple-500/50 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.35)] hover:translate-y-[-2px] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-purple-950/40 text-purple-400 rounded-xl flex items-center justify-center border border-purple-900/40 shadow-sm">
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Flow 1 — Create Resume Scratch</span>
                      <span className="text-[9px] bg-purple-950/80 text-purple-455 rounded-full py-0.5 px-2 font-black">START FRESH 🚀</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                      Use a responsive structured builder form with multi-step sections, live dynamic preview scaling, template swaps, and inline AI suggestions. Auto saves using localStorage parameters.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2.5 text-xs text-purple-455 font-bold">
                  <span>Enter Scratch Builder</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* FLOW 2: UPLOAD & IMPROVE RESUME */}
              <div
                className="group relative bg-[#090b11] hover:bg-[#0d1222] border border-slate-800/80 hover:border-emerald-500/50 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.35)] hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-950/40 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-900/40 shadow-sm">
                    <Upload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Flow 2 — Upload Existing Resume</span>
                      <span className="text-[9px] bg-emerald-950/80 text-emerald-455 rounded-full py-0.5 px-2 font-black">AI CLONE ⚡</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                      Upload your current PDF, DOCX, or TXT file. Our system extracts text, maps it to schema, analyses structural flaws, checks ATS scoring, and displays comparative before-and-after improvements.
                    </p>
                  </div>
                </div>

                {/* Instant Drag & Drop Upload Zone inside Landing card */}
                <div className="mt-6 border border-dashed border-slate-800 group-hover:border-emerald-500/50 rounded-xl p-4 bg-[#070b14]/60 relative text-center transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {parsingLoading ? (
                    <div className="flex flex-col items-center gap-2 py-1.5">
                      <RefreshCw className="animate-spin text-emerald-500" size={18} />
                      <span className="text-[10px] font-bold text-emerald-600 animate-pulse">{scanningStatus}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-300 font-sans">DRAG & DROP OR EXPLORE COMPUTER</div>
                      <p className="text-[9px] text-slate-400 font-sans">PDF, DOCX, TXT files up to 20MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Return to Home / Back Link */}
            <div className="text-center pt-6">
              <button
                onClick={() => setActiveFlow("home")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-400 transition-colors font-sans"
              >
                <ArrowLeftRight size={12} className="rotate-180" />
                <span>Return to Landing Homepage</span>
              </button>
            </div>
          </div>
        )}

        {/* 1.5 ABOUT PAGE VIEW */}
        {activeFlow === "about" && (
          <div className="py-12 px-4 max-w-4xl mx-auto space-y-12">
            {/* Hero Header */}
            <div className="text-center space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">
                [ THE BLUEPRINT 📈 ]
              </h2>
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text max-w-2xl mx-auto leading-tight italic">
                About RESUME
              </h3>
              <p className="text-xs sm:text-sm text-slate-350 max-w-xl mx-auto font-sans leading-relaxed">
                A premium, client-side resume builder and ATS optimizer created by <span className="text-purple-400 font-bold">Chetan Janjalkar</span>, built to keep your data private and get you hired. Secure the bag, no cap.
              </p>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Feature 1: Privacy */}
              <div className="bg-[#090b11] border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.25)] transition-shadow space-y-3">
                <div className="w-10 h-10 bg-purple-950/40 text-purple-400 rounded-xl flex items-center justify-center border border-purple-900/40">
                  <Database size={18} />
                </div>
                <h4 className="text-sm font-extrabold text-white font-sans font-space">Private AF (100% Client-Side)</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  No databases, no tracking cookies, no signup forms. Your resume files save straight to browser LocalStorage. Your data is yours, period.
                </p>
              </div>

              {/* Feature 2: ATS Scanner */}
              <div className="bg-[#090b11] border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.25)] transition-shadow space-y-3">
                <div className="w-10 h-10 bg-cyan-950/40 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-900/40">
                  <Award size={18} />
                </div>
                <h4 className="text-sm font-extrabold text-white font-sans font-space">Beat the ATS Filter</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Analyze content against actual recruiter filters. Check keyword density, find structural issues, and get direct fixes to raise your interview callbacks.
                </p>
              </div>

              {/* Feature 3: AI Assistant */}
              <div className="bg-[#090b11] border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)] transition-shadow space-y-3">
                <div className="w-10 h-10 bg-pink-950/40 text-pink-400 rounded-xl flex items-center justify-center border border-pink-900/40">
                  <Sparkles size={18} />
                </div>
                <h4 className="text-sm font-extrabold text-white font-sans font-space">Let the AI Cook</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Use our contextual career assistant to polish summary bullets, structure experiences, and run mock interviews. Get actionable, real-time advice.
                </p>
              </div>

              {/* Feature 4: Vector PDF */}
              <div className="bg-[#090b11] border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_25px_-5px_rgba(234,179,8,0.25)] transition-shadow space-y-3">
                <div className="w-10 h-10 bg-yellow-950/40 text-yellow-400 rounded-xl flex items-center justify-center border border-yellow-900/40">
                  <FileText size={18} />
                </div>
                <h4 className="text-sm font-extrabold text-white font-sans font-space">Selectable Vector PDFs</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Export clean, standard vector PDFs designed for fast indexing. Perfect compatibility with modern HR software and human reviewers.
                </p>
              </div>
            </div>

            {/* How It Works Steps section */}
            <div className="pt-8 space-y-6">
              <div className="text-center space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono">
                  SIMPLE 3-STEP WORKFLOW
                </h4>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-purple-300 to-white text-transparent bg-clip-text italic">
                  How It Works ✨
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Step 1 */}
                <div className="bg-[#090b11] border border-slate-800/60 border-t-2 border-t-cyan-400 rounded-2xl p-6 space-y-4 relative shadow-2xl">
                  <div className="flex items-center gap-2.5 pb-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black flex items-center justify-center text-[10px]">
                      1
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-tight font-sans">
                      Choose Your Entry Flow
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Choose to start fresh using our intuitive builder forms or drop an existing document for instant schema extraction.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1 font-sans">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <span>Fresh Resume Builder</span>
                        </div>
                        <span className="font-mono">95%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: "95%" }} />
                      </div>
                    </div>

                    <div className="space-y-1 font-sans">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          <span>PDF Parser Engine</span>
                        </div>
                        <span className="font-mono">88%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: "88%" }} />
                      </div>
                    </div>

                    <div className="space-y-1 font-sans font-mono">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                          <span>Schema Auto-Mapper</span>
                        </div>
                        <span className="font-mono">90%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-400" style={{ width: "90%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#090b11] border border-slate-800/60 border-t-2 border-t-pink-500 rounded-2xl p-6 space-y-4 relative shadow-2xl">
                  <div className="flex items-center gap-2.5 pb-2">
                    <div className="w-5 h-5 rounded-full bg-pink-500 text-white font-black flex items-center justify-center text-[10px]">
                      2
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-tight font-sans">
                      Let the AI Cook 👨‍🍳
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Rewrite work history bullets, optimize formatting, and consult the AI Copilot to check structural alignment.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1 font-sans">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>AI Summary Rewriter</span>
                        </div>
                        <span className="font-mono">82%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400" style={{ width: "82%" }} />
                      </div>
                    </div>

                    <div className="space-y-1 font-sans">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span>Bullet Point Optimizer</span>
                        </div>
                        <span className="font-mono">85%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-200" style={{ width: "85%" }} />
                      </div>
                    </div>

                    <div className="space-y-1 font-sans font-mono">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                          <span>Copilot Career Chat</span>
                        </div>
                        <span className="font-mono">88%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400" style={{ width: "88%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#090b11] border border-slate-800/60 border-t-2 border-t-purple-500 rounded-2xl p-6 space-y-4 relative shadow-2xl">
                  <div className="flex items-center gap-2.5 pb-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-[10px]">
                      3
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-tight font-sans">
                      Pass ATS & Apply 📈
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Generate an ATS compatibility report, review recommended changes, and download a printer-ready vector PDF.
                  </p>

                  <div className="space-y-3 pt-1 font-sans">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          <span>ATS Score Matcher</span>
                        </div>
                        <span className="font-mono">90%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: "90%" }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>Vector PDF Renderer</span>
                        </div>
                        <span className="font-mono">95%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400" style={{ width: "95%" }} />
                      </div>
                    </div>

                    <div className="space-y-1 font-sans font-mono">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 font-sans">
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          <span>Direct Local Sync</span>
                        </div>
                        <span className="font-mono">80%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500" style={{ width: "80%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back button */}
            <div className="text-center pt-4">
              <button
                onClick={() => setActiveFlow("home")}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-550 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all hover:translate-y-[-1px] font-sans"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

        {/* 2. MAIN ACTIVE WORKSPACE PLATFORM DASHBOARD */}
        {activeFlow === "dashboard" && (
          <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 print:py-0 print:px-0 print:m-0 print:max-w-none print:space-y-0 print:block">

            {/* Top Workspace status bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-850 pb-4 print-hidden print:hidden">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest font-mono">
                  <span>Resume Workspace</span>
                  <span className="text-slate-700">›</span>
                  <span className="text-purple-400">Active Project</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text">
                    {resumeData.personalInfo?.fullName || "Unnamed Resume"}
                  </span>
                </h2>
                {resumeData.personalInfo?.jobTitle && (
                  <p className="text-xs sm:text-sm text-slate-400 font-semibold font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    {resumeData.personalInfo.jobTitle}
                  </p>
                )}
              </div>

              {/* Back to lander */}
              <button
                onClick={() => setActiveFlow("home")}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-purple-600 leading-none"
              >
                <ArrowLeftRight size={12} />
                <span>Switch Architecture Flow</span>
              </button>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex overflow-x-auto gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 max-w-max print-hidden print:hidden">
              <button
                onClick={() => setActiveSubTab("editor")}
                className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === "editor"
                  ? "bg-white dark:bg-violet-950/50 text-purple-650 dark:text-violet-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                1. Edit Content Form
              </button>

              <button
                onClick={() => {
                  setActiveSubTab("ats");
                  if (!atsReport) handleAnalyzeATSScore();
                }}
                className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === "ats"
                  ? "bg-white dark:bg-violet-950/50 text-purple-650 dark:text-violet-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                <span>2. ATS Score & Job Matching</span>
                {atsReport && (
                  <span className="text-[9px] bg-purple-100 dark:bg-violet-950/90 text-purple-700 dark:text-violet-300 font-black px-1.5 py-0.2 rounded">
                    Score: {atsReport.score}%
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveSubTab("copilot")}
                className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === "copilot"
                  ? "bg-white dark:bg-violet-950/50 text-purple-650 dark:text-violet-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                3. AI Career Copilot Chat
              </button>

              <button
                onClick={() => setActiveSubTab("compare")}
                className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeSubTab === "compare"
                  ? "bg-white dark:bg-violet-950/50 text-purple-650 dark:text-violet-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                <span>4. Before-After Changes & Revisions</span>
                {beforeResumeData && (
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-extrabold px-1 rounded uppercase">Upload Compare Active</span>
                )}
              </button>
            </div>

            {/* Split layout: Sub Tabs (Left) + Print/Visual Sheet preview (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block print:p-0 print:m-0">

              {/* Left Segment: tab execution content */}
              <div className="lg:col-span-6 space-y-4 print-hidden print:hidden">

                {/* 2.1 Tab edit forms */}
                {activeSubTab === "editor" && (
                  <ResumeForm
                    data={resumeData}
                    onChange={setResumeData}
                    onAIAction={handleAIAction}
                    aiLoading={aiLoading}
                    strengthScore={calculateLocalStrength()}
                  />
                )}

                {/* 2.2 ATS score tracker dashboard */}
                {activeSubTab === "ats" && (
                  <ATSScoreReport
                    report={atsReport}
                    resumeData={resumeData}
                    onAnalyzeATS={handleAnalyzeATSScore}
                    loading={atsScoreLoading}
                    onAnalyzeKeyword={handleKeywordAnalyze}
                    keywordReport={keywordReport}
                    keywordLoading={keywordLoading}
                  />
                )}

                {/* 2.3 Career AI Copilot chatbot */}
                {activeSubTab === "copilot" && (
                  <AIAssistantChat
                    resumeData={resumeData}
                    messages={chatMessages}
                    onSendMessage={handleSendChatMessage}
                    loading={chatLoading}
                  />
                )}

                {/* 2.4 Changes, JSON tools and Versions snapshots */}
                {activeSubTab === "compare" && (
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-5 space-y-6">

                    {/* Before vs After comparison if uploaded resume exists */}
                    {beforeResumeData ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg border border-slate-200">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">File Before vs After AI Improvement comparison</h4>
                            <p className="text-[10px] text-slate-500">Track summary transformations and detail expansion instantly.</p>
                          </div>

                          <button
                            onClick={() => {
                              addVersionSnapshot("Backup of current edits before reverting to Upload Origin");
                              setResumeData(beforeResumeData);
                              alert("Restored uploaded context.");
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 bg-white border rounded"
                          >
                            Restore Origin
                          </button>
                        </div>

                        {/* Split comparing profiles Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-red-50/20 dark:bg-rose-950/10 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <span className="text-[10px] font-bold text-red-650 uppercase">Origin Parsed Summary:</span>
                            <p className="text-[11px] text-slate-650 dark:text-slate-400 mt-1 italic">
                              {beforeResumeData.summary || "No career summary populated initially in the file."}
                            </p>
                          </div>

                          <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <span className="text-[10px] font-bold text-emerald-650 uppercase">Polished Active Summary:</span>
                            <p className="text-[11px] text-slate-650 dark:text-slate-400 mt-1">
                              {resumeData.summary || "Describe details or generate to verify modifications."}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold">Compare changes option</h4>
                        <p className="text-[10px] text-slate-500">
                          This compare panel highlights modifications for uploaded resumes. Go back to Home and drop a PDF file to activate structural comparisons!
                        </p>
                      </div>
                    )}

                    {/* Version Control snapshot */}
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Revision History & Branches</h4>
                          <p className="text-[10px] text-slate-500">Manually capture backup stages to roll back edits safely.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const label = prompt("Enter tag description for your revision branch:", `Revision #${resumeVersions.length + 1}`);
                            if (label) addVersionSnapshot(label);
                          }}
                          className="px-2.5 py-1 text-[10px] font-extrabold text-white bg-indigo-600 rounded"
                        >
                          Capture Snap
                        </button>
                      </div>

                      {resumeVersions.length === 0 ? (
                        <p className="text-[11px] text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-dashed border-slate-200">No manual snaphots captured. Tap "Capture Snap" to commit backup revisions.</p>
                      ) : (
                        <div className="space-y-2">
                          {resumeVersions.map((ver) => (
                            <div key={ver.id} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 rounded-lg">
                              <div className="space-y-0.5">
                                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{ver.label}</p>
                                <span className="text-[9px] text-slate-400 font-mono">{ver.timestamp}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => revertToVersion(ver)}
                                  className="px-2 py-0.5 text-[9px] font-bold text-indigo-600 bg-white border rounded"
                                >
                                  Rollback
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteVersion(ver.id)}
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 rounded hover:text-red-650"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Segment: Live Sheet Visual Preview Panel (Scaled sticky component) */}
              <div className="lg:col-span-6 sticky top-20 print:static print:block print:w-full print:p-0 print:m-0">
                <ResumePreview
                  data={resumeData}
                  templateId={templateId}
                  onTemplateChange={setTemplateId}
                  onExportJson={handleExportJson}
                  onImportJson={handleImportJson}
                />
              </div>

            </div>
          </div>
        )}

      </main>

      <footer className="bg-[#05070c] border-t border-slate-900 py-12 text-slate-500 print-hidden print:hidden shrink-0 mt-auto relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 text-left relative z-10">
          {/* Column 1: DC Resume Info */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2" title="Developer Chetan">
              <img
                src={logoImg}
                className="w-6 h-6 object-contain opacity-80"
                alt="Developer Chetan Logo"
              />
              <div className="flex items-center gap-1">
                <span className="bg-gradient-to-r from-purple-500 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text text-base font-black tracking-wider font-space">
                  RESUME
                </span>
                <span className="px-1 py-0.2 text-[8px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded font-mono select-none leading-none animate-blink-green">
                  AI
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 max-w-md leading-relaxed">
              A premium, client-side private resume builder and ATS optimizer designed to build high-fidelity resumes. Your data never leaves your browser.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.linkedin.com/in/chetan-janjalkar-2a92a432b/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/30 hover:scale-105 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="https://x.com/chetanjanjalkar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-105 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={15} />
              </a>
              <a
                href="https://github.com/Chetanjanjalkar791"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:scale-105 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Support Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-space">Support</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>
                <button
                  onClick={() => setActiveFlow("about")}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  About
                </button>
              </li>
              <li>
                <a
                  href="mailto:chetanjanjalkar791@gmail.com"
                  className="hover:text-purple-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <button
                  onMouseEnter={handleFAQMouseEnter}
                  onMouseLeave={handleFAQMouseLeave}
                  onClick={() => setFaqOpen(!faqOpen)}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left font-medium"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Separation Line */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="w-full h-[1px] bg-slate-900" />
        </div>

        {/* Bottom Copyright & Values */}
        <div className="max-w-7xl mx-auto px-6 mt-6 text-[10px] text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-400">© 2026 AI Smart Resume Builder Engine. Created by <span className="text-purple-400 font-bold">Chetan Janjalkar</span>. All rights reserved.</p>
          <div className="flex gap-4 font-medium text-slate-500">
            <span>Zero Databases</span>
            <span>•</span>
            <span>Client-Side Encryption</span>
            <span>•</span>
            <span>Optimized PDF</span>
          </div>
        </div>
      </footer>

      {faqOpen && (
        <div
          className="fixed bottom-24 right-6 md:right-24 z-50 p-6 bg-[#0b0e17]/95 backdrop-blur-md border border-slate-800 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 print:hidden"
          onMouseEnter={handleFAQMouseEnter}
          onMouseLeave={handleFAQMouseLeave}
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-widest font-space flex items-center gap-2">
            <HelpCircle className="text-purple-400" size={16} />
            <span>FAQ - Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3.5 text-xs text-slate-350 leading-relaxed font-sans max-h-[50vh] overflow-y-auto">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100 font-sans">1. Is it free?</h4>
              <p>Yes, DCResume AI is 100% free with unlimited optimizations.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-100 font-sans">2. Where is my data saved?</h4>
              <p>All data stays directly in your browser's LocalStorage. No server databases, complete privacy.</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-100 font-sans">3. How do I download as PDF?</h4>
              <p>Click "Export A4 Print Vector PDF" to trigger the browser's standard printer layout, then choose "Save as PDF".</p>
            </div>
          </div>

          <button
            onClick={() => setFaqOpen(false)}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-550 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer font-sans"
          >
            Got it, thanks!
          </button>
        </div>
      )}

    </div>
  );
}
