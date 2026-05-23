import React, { useState, useRef, useEffect } from "react";
import { ResumeData } from "../types";
import { MessageSquare, Send, Sparkles, User, RefreshCw, Star, Info } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

interface AIAssistantChatProps {
  resumeData: ResumeData;
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  resumeData,
  messages,
  onSendMessage,
  loading
}) => {
  const [inputText, setInputText] = useState<string>("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleShortcutClick = (prompt: string) => {
    if (loading) return;
    onSendMessage(prompt);
  };

  const shortcuts = [
    { label: "🎤 AI Mock Prep", prompt: "Conduct an AI Mock Interview based on my work experience. Ask a tough role-related question first!" },
    { label: "✍ LinkedIn Bio", prompt: "Generate 3 professional and click-friendly LinkedIn bios based on my resume details." },
    { label: "🔍 Resume Strength Check", prompt: "Identify 3 potential weaknesses in my experience bullet points and tell me how to resolve them with metrics." },
    { label: "✉ Draft Cover Letter", prompt: "Generate a beautifully tailored Cover Letter draft based on my background." }
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden flex flex-col h-[700px] max-h-[80vh]">
      
      {/* Header bar */}
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} />
          <div>
            <h3 className="text-xs sm:text-sm font-bold">AI Career Copilot</h3>
            <p className="text-[10px] text-purple-200">Interactive resume brainstorming and prep</p>
          </div>
        </div>
        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active Resume Context</span>
      </div>

      {/* Messages Pane */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Intro prompt */}
        {messages.length === 0 && (
          <div className="space-y-4 text-center max-w-sm mx-auto py-8">
            <div className="w-10 h-10 bg-purple-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Ask anything about your career path</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-1">
                Your resume is synced. Ask me to formulate bullet points, write portfolio summaries, conduct a mock interview, or correct layouts.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar indicator */}
              <div className={`p-1.5 rounded-full shrink-0 ${isUser ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                {isUser ? <User size={12} /> : <Sparkles size={12} />}
              </div>

              {/* Message block */}
              <div 
                className={`text-xs max-w-[80%] rounded-2xl p-3 leading-relaxed whitespace-pre-line ${
                  isUser 
                    ? "bg-purple-600 text-white rounded-tr-none" 
                    : "bg-slate-50 dark:bg-slate-950/50 dark:text-slate-100 dark:border dark:border-slate-800 rounded-tl-none border border-slate-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full shrink-0">
              <Sparkles size={12} className="animate-pulse" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl rounded-tl-none p-3 border border-slate-150 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <RefreshCw className="animate-spin" size={12} />
                <span>AI is formulating suggestions...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggestion Shortcuts Margin */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-855 shrink-0">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1">
          <Star size={9} className="text-purple-500" />
          <span>One-Click Copilot Utilities</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {shortcuts.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleShortcutClick(sc.prompt)}
              disabled={loading}
              className="text-left px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-purple-400 dark:hover:border-purple-900 hover:bg-slate-50 dark:hover:bg-slate-850 truncate transition-colors cursor-pointer"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-250/50 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={loading ? "Formulating reply..." : "Ask your coach an improvement step..."}
          disabled={loading}
          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:outline-none focus:bg-white dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="p-2.5 text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 disabled:from-slate-400 disabled:to-slate-400 rounded-xl shadow transition-all cursor-pointer shrink-0"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
};
