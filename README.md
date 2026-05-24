<div align="center">

# 🚀 DCResume AI — Smart Resume Builder & ATS Optimizer

**Created by Chetan Janjalkar**

**Build resumes that actually get you hired.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ What is DCResume AI?

DCResume AI is a **privacy-first, client-side resume builder** with built-in **ATS (Applicant Tracking System) scoring**, **AI-powered content optimization**, and **real-time resume previews**. Built for the modern job seeker — no accounts, no databases, no subscriptions.

> **No logins • No data collection • 100% free optimization**

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **100% Client-Side Privacy** | All resume data stays in your browser's LocalStorage. Zero cloud sync, zero data leaks. |
| 📊 **ATS Score & Diagnostics** | Analyze your resume against real Applicant Tracking System parameters and get actionable fixes. |
| 🤖 **AI Copilot** | Optimize summaries, rewrite experience bullets, and run mock interview simulations via chat. |
| 📝 **Multiple Templates** | Switch between Modern Swiss, Classic Serif, and Technical Mono resume styles instantly. |
| 📄 **Vector PDF Export** | Print-ready, ATS-compatible vector PDFs designed for fast indexing by HR software. |
| 🔄 **Before/After Comparison** | Upload an existing resume and track improvements side-by-side. |
| 📂 **Version History** | Automatic snapshot backups with one-click restore to any previous version. |
| 🎨 **Gen-Z Design** | Modern, dark-themed UI with neon gradients, glassmorphism, and micro-animations. |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom design tokens
- **Fonts:** Space Grotesk + Plus Jakarta Sans (Google Fonts)
- **Icons:** Lucide React
- **Backend:** Node.js + Express (for AI API proxy)
- **PDF:** Browser native print-to-PDF (vector output)
- **Storage:** Browser LocalStorage (no database)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A Gemini API key (for AI features) — get one at [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chetanjanjalkar791/DCResume-ai.git
   cd DCResume-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your API key:
   ```
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🧑‍💻 How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  1. INPUT        │ ──▶ │  2. OPTIMIZE     │ ──▶ │  3. SCORE & EXPORT │
│                  │     │                  │     │                    │
│  Create from     │     │  AI rewrites     │     │  ATS compatibility │
│  scratch or      │     │  summaries &     │     │  scoring + vector  │
│  upload existing │     │  experience      │     │  PDF download      │
│  resume          │     │  bullets         │     │                    │
└─────────────────┘     └──────────────────┘     └────────────────────┘
```

1. **Choose Your Flow** — Start fresh with a blank builder or upload an existing PDF/DOCX/TXT resume
2. **Edit & Optimize** — Use the structured form editor with AI-powered suggestions for each section
3. **Score & Export** — Run ATS diagnostics, compare before/after, and download your optimized resume

---

## 📁 Project Structure

```
DCResume-ai/
├── src/
│   ├── App.tsx                 # Main app with routing & all page views
│   ├── components/
│   │   ├── ResumeForm.tsx      # Multi-section resume editor form
│   │   ├── ResumePreview.tsx   # Live preview with zoom & template controls
│   │   ├── ATSScoreReport.tsx  # ATS scoring & keyword analysis dashboard
│   │   └── AIAssistantChat.tsx # AI career copilot chat interface
│   ├── templates/
│   │   └── ResumeTemplates.tsx # Modern, Classic, and Mono resume templates
│   ├── types.ts                # TypeScript type definitions
│   ├── index.css               # Global styles & design tokens
│   └── main.tsx                # App entry point
├── server.ts                   # Express backend (API proxy)
├── index.html                  # HTML entry
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Chetan Janjalkar](https://github.com/Chetanjanjalkar791)**

</div>
