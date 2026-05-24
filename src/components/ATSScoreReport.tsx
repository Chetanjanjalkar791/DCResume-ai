import React, { useState } from "react";
import { ATSReport, KeywordMatchReport, ResumeData } from "../types";
import { 
  Sparkles, CheckCircle, AlertTriangle, List, Search, Target, Award, ArrowRight,
  TrendingUp, RefreshCw, AlignLeft, ShieldCheck
} from "lucide-react";

interface ATSScoreReportProps {
  report: ATSReport | null;
  resumeData: ResumeData;
  onAnalyzeATS: () => void;
  loading: boolean;
  onAnalyzeKeyword: (jobDesc: string) => Promise<void>;
  keywordReport: KeywordMatchReport | null;
  keywordLoading: boolean;
}

export const ATSScoreReport: React.FC<ATSScoreReportProps> = ({
  report,
  resumeData,
  onAnalyzeATS,
  loading,
  onAnalyzeKeyword,
  keywordReport,
  keywordLoading
}) => {
  const [jobDescription, setJobDescription] = useState<string>("");

  const handleKeywordAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    onAnalyzeKeyword(jobDescription);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section - Score Gauge */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Award className="text-purple-600 dark:text-purple-400" size={18} />
              <span>AI Resume & ATS Scanner</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check compatibility, structural balance, syntax errors, and core strength based on targeted roles. Scan instantly using model rules.
            </p>
            
            <button
              onClick={onAnalyzeATS}
              disabled={loading}
              className="mt-2 flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 disabled:from-slate-400 disabled:to-slate-400 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Target size={14} />}
              <span>Scan Resume Integrity</span>
            </button>
          </div>

          {/* Big Score visualizer */}
          <div className="flex items-center gap-4 shrink-0 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-4 rounded-xl">
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Circular gauge */}
              <svg className="w-full h-full transform -rotate-95">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-slate-200 dark:stroke-slate-850"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-purple-600 transition-all duration-700"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * (report?.score || 45)) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{report?.score || "--"}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">ATS Score</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-350">
              <div className="flex items-center gap-1.5 font-bold">
                <TrendingUp size={12} className="text-emerald-500" />
                <span>Goal: &gt; 80 for ATS success</span>
              </div>
              <p className="text-[10px] text-slate-400 max-w-[150px]">
                {report ? "Scan processed. Look below for step-by-step refinements." : "Click scan above to establish complete scorecard insights."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report breakdown section */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Positives & Recommended Skills */}
          <div className="space-y-4">
            {/* Strengths Card */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-md border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <CheckCircle size={14} />
                <span>Found Strengths</span>
              </h4>
              <ul className="space-y-1.5">
                {report.positives?.map((pos, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-emerald-300 flex items-start gap-1">
                    <span className="text-emerald-500 select-none">•</span>
                    <span>{pos}</span>
                  </li>
                ))}
                {(!report.positives || report.positives.length === 0) && (
                  <li className="text-xs text-slate-400 italic">No major highlights checked. Try adding quantified achievements.</li>
                )}
              </ul>
            </div>

            {/* Missing Keywords & Recommended Skills */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 backdrop-blur-md border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <List size={14} />
                  <span>Missing Search Keywords</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {report.missingKeywords?.map((kw, idx) => (
                    <span key={idx} className="text-[10px] sm:text-xs font-medium bg-indigo-100 hover:bg-slate-200 text-indigo-750 dark:bg-slate-900 dark:text-slate-250 py-0.5 px-2 rounded">
                      {kw}
                    </span>
                  ))}
                  {(!report.missingKeywords || report.missingKeywords.length === 0) && (
                    <span className="text-xs text-slate-400 italic">None. Resume is keyword dense!</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Sparkles size={13} className="text-indigo-500" />
                  <span>Missing Domain Skills Recommended</span>
                </h4>
                <div className="flex flex-wrap gap-1 pt-1">
                  {report.recommendedSkills?.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-850 dark:text-indigo-250 hover:bg-indigo-50 text-slate-750 py-0.5 px-2 rounded-full font-medium border border-slate-200 dark:border-slate-800">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grammar & Weakness Improvements */}
          <div className="space-y-4">
            {/* Improvements Required */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-md border border-amber-150 dark:border-amber-900/40 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <AlertTriangle size={14} />
                <span>Actionable Improvements</span>
              </h4>
              <ul className="space-y-1.5">
                {report.improvements?.map((imp, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-amber-300/90 flex items-start gap-1">
                    <span className="text-amber-500 select-none">→</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Grammar / Editing Issues */}
            <div className="bg-rose-50/50 dark:bg-rose-950/15 backdrop-blur-md border border-rose-200 dark:border-rose-900/35 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <AlignLeft size={14} />
                <span>Grammar & Stylistic Refinements</span>
              </h4>
              <ul className="space-y-1.5">
                {report.grammarIssues?.map((iss, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-rose-350 flex items-start gap-1">
                    <span className="text-rose-400 select-none">✓</span>
                    <span>{iss}</span>
                  </li>
                ))}
                {(!report.grammarIssues || report.grammarIssues.length === 0) && (
                  <li className="text-xs text-slate-500 italic flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>No grammatical layout issues detected. Looking polished!</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section - Job Description Match Tool */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
          <Target className="text-indigo-600 dark:text-indigo-400" size={17} />
          <span>Job Description (JD) Keyword Matcher</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Paste the specifications of a targeted job posting below. We'll cross-reference the keywords and calculate a direct relevance score with specialized recommendations.
        </p>

        <form onSubmit={handleKeywordAnalyzeSubmit} className="space-y-3">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste description of targeted position here..."
            rows={4}
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100 font-sans leading-relaxed"
          />
          <button
            type="submit"
            disabled={keywordLoading || !jobDescription.trim()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-400 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {keywordLoading ? <RefreshCw className="animate-spin" size={12} /> : <Search size={12} />}
            <span>Match Job Profile</span>
          </button>
        </form>

        {/* Display JD report */}
        {keywordReport && (
          <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-4 rounded-xl">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Target Match Relevance</div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{keywordReport.matchPercentage}% Matching</div>
              </div>
              <div className="text-xs max-w-md text-slate-600 dark:text-slate-300">
                <span className="font-bold">Summary: </span> {keywordReport.roleRelevance}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950 rounded-xl">
                <h4 className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <CheckCircle size={13} />
                  <span>Matched Keywords</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {keywordReport.matchedKeywords?.map((word, idx) => (
                    <span key={idx} className="text-xs bg-emerald-100 dark:bg-slate-900 text-emerald-800 p-1 rounded font-semibold text-[10px]">
                      {word}
                    </span>
                  ))}
                  {(!keywordReport.matchedKeywords || keywordReport.matchedKeywords.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No direct matching terms extracted.</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-red-50/40 dark:bg-rose-950/10 border border-red-100 dark:border-rose-950 rounded-xl">
                <h4 className="text-[11px] font-bold text-red-800 dark:text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>Missing Vital Keywords ({keywordReport.missingKeywords?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {keywordReport.missingKeywords?.map((word, idx) => (
                    <span key={idx} className="text-xs bg-rose-100 dark:bg-slate-900 text-rose-800 p-1 rounded font-semibold text-[10px]">
                      {word}
                    </span>
                  ))}
                  {(!keywordReport.missingKeywords || keywordReport.missingKeywords.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No missing keywords found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Action Steps to bridge Job Description criteria:
              </h4>
              <ul className="space-y-1.5">
                {keywordReport.evaluationSummary?.map((point, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-350 flex items-start gap-1.5">
                    <ArrowRight size={12} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
