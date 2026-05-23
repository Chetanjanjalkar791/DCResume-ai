import React, { useState } from "react";
import { ResumeData } from "../types";
import { DynamicResume } from "../templates/ResumeTemplates";
import { Layout, ZoomIn, ZoomOut, Printer, Download, Eye, RotateCcw } from "lucide-react";
import jsPDF from "jspdf";

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
  onTemplateChange: (id: string) => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  data, 
  templateId, 
  onTemplateChange,
  onExportJson,
  onImportJson
}) => {
  const [zoom, setZoom] = useState<number>(0.85);

  const templates = [
    { id: "modern", name: "Modern Swiss" },
    { id: "classic", name: "Classic Serif" },
    { id: "creative", name: "Technical Mono" }
  ];

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.05, 1.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.05, 0.5));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const element = document.getElementById("resume-container-print");
      if (!element) {
        alert("Resume print target not found.");
        return;
      }

      // Hide panels and print directly
      window.print();
    } catch (err) {
      console.error("PDF generation failure: ", err);
      window.print();
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg p-4 flex flex-col h-full overflow-hidden print:border-none print:shadow-none print:p-0 print:bg-transparent print:overflow-visible print:block print:h-auto">
      
      {/* Header and tools */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 print-hidden print:hidden">
        
        {/* Template Selector */}
        <div className="flex items-center gap-2">
          <Layout size={14} className="text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Style:</span>
          <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg">
            {templates.map((temp) => (
              <button
                key={temp.id}
                onClick={() => onTemplateChange(temp.id)}
                className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-colors ${
                  templateId === temp.id 
                    ? "bg-white dark:bg-slate-800 text-purple-650 dark:text-purple-400 shadow-sm" 
                    : "text-slate-400 dark:text-slate-400 hover:text-slate-200 dark:hover:text-slate-100"
                }`}
              >
                {temp.name}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Operations */}
        <div className="flex items-center gap-2.5">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={12} />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-500">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={12} />
            </button>
          </div>

          {/* Print & Download buttons */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-650 to-fuchsia-650 hover:from-purple-700 hover:to-fuchsia-700 rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            title="Saves directly to vector PDF via print dialogue"
          >
            <Printer size={12} />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          {/* Extra utility export JSON */}
          <button
            onClick={onExportJson}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40 rounded hover:bg-purple-50 dark:hover:bg-purple-950/20 text-center"
            title="Export Resume data as JSON document"
          >
            <span className="hidden md:inline">Export Backup</span>
          </button>

          {/* Import Backup */}
          <label className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-center">
            <span className="hidden md:inline">Import</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={onImportJson} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Sheet Container */}
      <div className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-950 p-4 rounded-xl flex items-start justify-center min-h-[350px] print:bg-transparent print:p-0 print:overflow-visible print:block">
        
        {/* Scaling Wrapper */}
        <div 
          className="resume-print-wrapper origin-top transition-transform duration-150 bg-white shadow-xl dark:shadow-slate-950/40 rounded overflow-hidden print:shadow-none print:rounded-none print:overflow-visible"
          style={{ transform: `scale(${zoom})`, width: "100%", maxWidth: "21cm" }}
        >
          <DynamicResume data={data} templateId={templateId} />
        </div>
      </div>
    </div>
  );
};
