import React, { useState } from "react";
import { ResumeData, Experience, Project, Education, Skill, Certification, Language, Achievement, CustomSection } from "../types";
import { 
  User, Briefcase, Code, GraduationCap, Award, Globe, Plus, Trash2, ArrowUp, ArrowDown, 
  Sparkles, CheckCircle, Calendar, ChevronDown, ChevronUp, RefreshCw, Wand2, PlusCircle
} from "lucide-react";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (updated: ResumeData) => void;
  onAIAction: (type: "summary" | "experience" | "project" | "skills" | "improveAll", sectionId?: string) => Promise<void>;
  aiLoading: boolean;
  strengthScore: number;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, onAIAction, aiLoading, strengthScore }) => {
  const [activeTab, setActiveTab] = useState<string>("personal");

  // Helper selectors
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const updateSummary = (value: string) => {
    onChange({
      ...data,
      summary: value
    });
  };

  // Reorder Item helper
  const reorderItem = <T extends { id: string }>(list: T[], index: number, direction: "up" | "down", key: keyof ResumeData) => {
    const newList = [...list];
    if (direction === "up" && index > 0) {
      const temp = newList[index];
      newList[index] = newList[index - 1];
      newList[index - 1] = temp;
    } else if (direction === "down" && index < newList.length - 1) {
      const temp = newList[index];
      newList[index] = newList[index + 1];
      newList[index + 1] = temp;
    }
    onChange({ ...data, [key]: newList });
  };

  // Generic lists modifier
  const addExperience = () => {
    const newItem: Experience = {
      id: "exp_" + Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    onChange({ ...data, experiences: [...(data.experiences || []), newItem] });
  };

  const addProject = () => {
    const newItem: Project = {
      id: "proj_" + Date.now(),
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      link: ""
    };
    onChange({ ...data, projects: [...(data.projects || []), newItem] });
  };

  const addEducation = () => {
    const newItem: Education = {
      id: "edu_" + Date.now(),
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: ""
    };
    onChange({ ...data, education: [...(data.education || []), newItem] });
  };

  const addSkill = () => {
    const newItem: Skill = {
      id: "skill_" + Date.now(),
      name: "",
      level: "Intermediate",
      category: "Technical"
    };
    onChange({ ...data, skills: [...(data.skills || []), newItem] });
  };

  const addCertification = () => {
    const newItem: Certification = {
      id: "cert_" + Date.now(),
      name: "",
      issuer: "",
      date: "",
      link: ""
    };
    onChange({ ...data, certifications: [...(data.certifications || []), newItem] });
  };

  const addLanguage = () => {
    const newItem: Language = {
      id: "lang_" + Date.now(),
      name: "",
      proficiency: "Conversational"
    };
    onChange({ ...data, languages: [...(data.languages || []), newItem] });
  };

  const addAchievement = () => {
    const newItem: Achievement = {
      id: "ach_" + Date.now(),
      title: "",
      description: "",
      date: ""
    };
    onChange({ ...data, achievements: [...(data.achievements || []), newItem] });
  };

  const addCustomSection = () => {
    const newItem: CustomSection = {
      id: "custom_" + Date.now(),
      title: "Additional Information",
      content: ""
    };
    onChange({ ...data, customSections: [...(data.customSections || []), newItem] });
  };

  // Generic deleter
  const deleteItem = <T extends { id: string }>(list: T[], id: string, key: keyof ResumeData) => {
    const filtered = list.filter(item => item.id !== id);
    onChange({ ...data, [key]: filtered });
  };

  // Generic field updater
  const updateItemField = <T extends { id: string }>(list: T[], id: string, field: string, value: any, key: keyof ResumeData) => {
    const updated = list.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ ...data, [key]: updated });
  };

  // Sections navigation Config
  const sections = [
    { id: "personal", label: "Contact", icon: User },
    { id: "summary", label: "Summary", icon: Sparkles },
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "languages", label: "Languages", icon: Globe },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "custom", label: "Custom Details", icon: PlusCircle },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden self-start flex flex-col md:flex-row h-full max-h-[85vh]">
      
      {/* Sidebar Nav (Mobile/Desktop friendly) */}
      <div className="w-full md:w-56 bg-slate-50 dark:bg-slate-950/40 p-3 border-r border-slate-200 dark:border-slate-800/60 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 gap-1 md:gap-1.5 snap-x">
        {sections.map((sect) => {
          const Icon = sect.icon;
          const isActive = activeTab === sect.id;
          return (
            <button
              key={sect.id}
              onClick={() => setActiveTab(sect.id)}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg shrink-0 snap-center transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/10" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "text-slate-500"} />
              <span>{sect.label}</span>
            </button>
          );
        })}

        {/* Global actions */}
        <div className="hidden md:block mt-auto pt-4 border-t border-slate-200 dark:border-slate-850">
          {/* Resume Strength Panel */}
          <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-100 dark:border-purple-900/50">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-purple-650 dark:text-purple-400 font-bold mb-1">
              <span>Resume Strength</span>
              <span>{strengthScore || 50}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-250 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-500" 
                style={{ width: `${strengthScore || 50}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-540 dark:text-slate-400 mt-1">Optimize layout and add detail to boost ATS success.</p>
          </div>
          
          <button
            onClick={() => onAIAction("improveAll")}
            disabled={aiLoading}
            className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 disabled:from-slate-400 disabled:to-slate-400 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {aiLoading ? <RefreshCw className="animate-spin" size={13} /> : <Wand2 size={13} />}
            <span>One-click AI Improve</span>
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* Personal Details */}
        {activeTab === "personal" && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Personal & Contact Info</h3>
              <p className="text-xs text-slate-500">Provide clean details for HR systems to context-map contact details.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo?.fullName || ""}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">Target Professional Title</label>
                <input
                  type="text"
                  value={data.personalInfo?.jobTitle || ""}
                  onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                  placeholder="React Frontend Engineer"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">Email Address</label>
                <input
                  type="email"
                  value={data.personalInfo?.email || ""}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">Phone Number</label>
                <input
                  type="text"
                  value={data.personalInfo?.phone || ""}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">Location</label>
                <input
                  type="text"
                  value={data.personalInfo?.location || ""}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  placeholder="New York, NY"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">Personal Website</label>
                <input
                  type="text"
                  value={data.personalInfo?.website || ""}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  placeholder="https://johndoe.dev"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={data.personalInfo?.github || ""}
                  onChange={(e) => updatePersonalInfo("github", e.target.value)}
                  placeholder="github.com/johndoe"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={data.personalInfo?.linkedin || ""}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {activeTab === "summary" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Professional Summary</h3>
                <p className="text-xs text-slate-500">Provide an overview of your career path to hook recruiters.</p>
              </div>
              <button
                type="button"
                onClick={() => onAIAction("summary")}
                disabled={aiLoading || !data.personalInfo?.jobTitle}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 rounded-lg focus:outline-none transition-colors"
                title="Fill or overwrite with customized professional AI summary"
              >
                {aiLoading ? <RefreshCw className="animate-spin" size={12} /> : <Sparkles size={12} />}
                <span>Auto-Generate</span>
              </button>
            </div>

            <div>
              <textarea
                value={data.summary || ""}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Write, paste or auto-generate your career summary here..."
                rows={6}
                className="w-full px-3 py-3 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:text-slate-100 resize-y leading-relaxed font-sans"
              />
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Work Experience</h3>
                <p className="text-xs text-slate-500">List previous jobs showing action verbs and metrics.</p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Job</span>
              </button>
            </div>

            {(!data.experiences || data.experiences.length === 0) && (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <Briefcase className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-xs text-slate-500">No work experiences added. Start by adding one!</p>
              </div>
            )}

            <div className="space-y-4">
              {data.experiences?.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative group">
                  
                  {/* Controls header */}
                  <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Job #{index + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => reorderItem(data.experiences, index, "up", "experiences")}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-35"
                        title="Move Up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderItem(data.experiences, index, "down", "experiences")}
                        disabled={index === data.experiences.length - 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-35"
                        title="Move Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAIAction("experience", exp.id)}
                        disabled={aiLoading || !exp.description}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded"
                        title="AI professional write of bullet points"
                      >
                        <Sparkles size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(data.experiences, exp.id, "experiences")}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 rounded"
                        title="Delete work experience"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company || ""}
                        onChange={(e) => updateItemField(data.experiences, exp.id, "company", e.target.value, "experiences")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.position || ""}
                        onChange={(e) => updateItemField(data.experiences, exp.id, "position", e.target.value, "experiences")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Start Date (e.g. May 2022)"
                        value={exp.startDate || ""}
                        onChange={(e) => updateItemField(data.experiences, exp.id, "startDate", e.target.value, "experiences")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="End Date (e.g. Present)"
                        disabled={exp.current}
                        value={exp.current ? "Present" : exp.endDate || ""}
                        onChange={(e) => updateItemField(data.experiences, exp.id, "endDate", e.target.value, "experiences")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100 disabled:bg-slate-150"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={exp.current || false}
                        onChange={(e) => updateItemField(data.experiences, exp.id, "current", e.target.checked, "experiences")}
                        id={`current_${exp.id}`}
                        className="rounded border-slate-350 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3 w-3"
                      />
                      <label htmlFor={`current_${exp.id}`} className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 select-none">
                        I am currently working in this role
                      </label>
                    </div>
                  </div>

                  <div>
                    <textarea
                      placeholder="Duties, key objectives reached and metrics e.g.:
- Leveraged React Router and Axios to decrease response latencies by 25%.
- Coordinated with and mentored 4 interns to polish mobile application interfaces."
                      value={exp.description || ""}
                      onChange={(e) => updateItemField(data.experiences, exp.id, "description", e.target.value, "experiences")}
                      rows={4}
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100 leading-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Projects</h3>
                <p className="text-xs text-slate-500">Showcase high-quality personal projects and client contracts.</p>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Project</span>
              </button>
            </div>

            {(!data.projects || data.projects.length === 0) && (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <Code className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-xs text-slate-500">No projects added yet. Click Add Project to showcase your code.</p>
              </div>
            )}

            <div className="space-y-4">
              {data.projects?.map((proj, index) => (
                <div key={proj.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative group">
                  <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Project #{index + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => reorderItem(data.projects, index, "up", "projects")}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-35"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderItem(data.projects, index, "down", "projects")}
                        disabled={index === data.projects.length - 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-35"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAIAction("project", proj.id)}
                        disabled={aiLoading || !proj.description}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded"
                        title="AI project optimizer"
                      >
                        <Sparkles size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(data.projects, proj.id, "projects")}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-650 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name || ""}
                        onChange={(e) => updateItemField(data.projects, proj.id, "name", e.target.value, "projects")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Role / Title"
                        value={proj.role || ""}
                        onChange={(e) => updateItemField(data.projects, proj.id, "role", e.target.value, "projects")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={proj.startDate || ""}
                        onChange={(e) => updateItemField(data.projects, proj.id, "startDate", e.target.value, "projects")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="End Date"
                        value={proj.endDate || ""}
                        onChange={(e) => updateItemField(data.projects, proj.id, "endDate", e.target.value, "projects")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Project Link (e.g. github.com/username/project)"
                        value={proj.link || ""}
                        onChange={(e) => updateItemField(data.projects, proj.id, "link", e.target.value, "projects")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      placeholder="Describe architectural choices, languages used and development outcomes."
                      value={proj.description || ""}
                      onChange={(e) => updateItemField(data.projects, proj.id, "description", e.target.value, "projects")}
                      rows={3}
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeTab === "education" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Education</h3>
                <p className="text-xs text-slate-500">Provide academic degrees and fields of study.</p>
              </div>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Education</span>
              </button>
            </div>

            {(!data.education || data.education.length === 0) && (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <GraduationCap className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-xs text-slate-500">No academic items. Add your degree or colleges.</p>
              </div>
            )}

            <div className="space-y-4">
              {data.education?.map((edu, index) => (
                <div key={edu.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative">
                  <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Degree #{index + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => reorderItem(data.education, index, "up", "education")}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-35"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderItem(data.education, index, "down", "education")}
                        disabled={index === data.education.length - 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-35"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(data.education, edu.id, "education")}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-650 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="School/University Name"
                        value={edu.school || ""}
                        onChange={(e) => updateItemField(data.education, edu.id, "school", e.target.value, "education")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Degree (e.g. Bachelor of Science)"
                        value={edu.degree || ""}
                        onChange={(e) => updateItemField(data.education, edu.id, "degree", e.target.value, "education")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Field of Study (e.g. Computer Science)"
                        value={edu.fieldOfStudy || ""}
                        onChange={(e) => updateItemField(data.education, edu.id, "fieldOfStudy", e.target.value, "education")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Graduation GPA or Grade: e.g. 3.8 / 4.0"
                        value={edu.grade || ""}
                        onChange={(e) => updateItemField(data.education, edu.id, "grade", e.target.value, "education")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={edu.startDate || ""}
                        onChange={(e) => updateItemField(data.education, edu.id, "startDate", e.target.value, "education")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="End Date (e.g. June 2024)"
                        value={edu.endDate || ""}
                        onChange={(e) => updateItemField(data.education, edu.id, "endDate", e.target.value, "education")}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Technologies and Core Skills</h3>
                <p className="text-xs text-slate-500">Add keywords that match Applicant Tracking Systems (ATS).</p>
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Skill</span>
              </button>
            </div>

            {(!data.skills || data.skills.length === 0) && (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <Code className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-xs text-slate-500">No skills added. Add stack languages to highlight.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.skills?.map((skill, index) => (
                <div key={skill.id} className="p-3 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Skill Name (e.g. TypeScript)"
                      value={skill.name || ""}
                      onChange={(e) => updateItemField(data.skills, skill.id, "name", e.target.value, "skills")}
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100 font-medium"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={skill.level || "Intermediate"}
                        onChange={(e) => updateItemField(data.skills, skill.id, "level", e.target.value, "skills")}
                        className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 rounded"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Category"
                        value={skill.category || ""}
                        onChange={(e) => updateItemField(data.skills, skill.id, "category", e.target.value, "skills")}
                        className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 rounded"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => deleteItem(data.skills, skill.id, "skills")}
                    className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-650 rounded-lg text-slate-500 hover:text-red-600 transition-colors shrink-0"
                    title="Delete skill"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {activeTab === "languages" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Languages</h3>
                <p className="text-xs text-slate-500">Enter languages spoken and relevant proficiency level.</p>
              </div>
              <button
                type="button"
                onClick={addLanguage}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Language</span>
              </button>
            </div>

            {(!data.languages || data.languages.length === 0) && (
              <p className="text-xs text-slate-500 text-center py-6">No languages listed. Highlight bilingual skills!</p>
            )}

            <div className="space-y-2">
              {data.languages?.map((lang) => (
                <div key={lang.id} className="flex items-center gap-3 p-3 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <input
                    type="text"
                    placeholder="Language name e.g. Spanish"
                    value={lang.name || ""}
                    onChange={(e) => updateItemField(data.languages, lang.id, "name", e.target.value, "languages")}
                    className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                  />
                  <select
                    value={lang.proficiency || "Conversational"}
                    onChange={(e) => updateItemField(data.languages, lang.id, "proficiency", e.target.value, "languages")}
                    className="px-2 py-1 text-xs bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 rounded-lg"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteItem(data.languages, lang.id, "languages")}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-650 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {activeTab === "certifications" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Certifications</h3>
                <p className="text-xs text-slate-500">List tech certifications, licenses, and relevant validation dates.</p>
              </div>
              <button
                type="button"
                onClick={addCertification}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Certificate</span>
              </button>
            </div>

            {(!data.certifications || data.certifications.length === 0) && (
              <p className="text-xs text-slate-500 text-center py-6">No certificates recorded. Click add to represent them.</p>
            )}

            <div className="grid grid-cols-1 gap-4">
              {data.certifications?.map((cert) => (
                <div key={cert.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => deleteItem(data.certifications, cert.id, "certifications")}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-550 hover:bg-red-50 rounded"
                    title="Remove certification"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <div>
                      <input
                        type="text"
                        placeholder="Certificate Name e.g. AWS Solutions Architect"
                        value={cert.name || ""}
                        onChange={(e) => updateItemField(data.certifications, cert.id, "name", e.target.value, "certifications")}
                        className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Issuer e.g. Amazon Web Services"
                        value={cert.issuer || ""}
                        onChange={(e) => updateItemField(data.certifications, cert.id, "issuer", e.target.value, "certifications")}
                        className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Date issued e.g. Oct 2024"
                        value={cert.date || ""}
                        onChange={(e) => updateItemField(data.certifications, cert.id, "date", e.target.value, "certifications")}
                        className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Verification Link (URL)"
                        value={cert.link || ""}
                        onChange={(e) => updateItemField(data.certifications, cert.id, "link", e.target.value, "certifications")}
                        className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Achievements</h3>
                <p className="text-xs text-slate-500">Outline awards, key corporate recognition, hacker wins, GPA honors.</p>
              </div>
              <button
                type="button"
                onClick={addAchievement}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Achievement</span>
              </button>
            </div>

            {(!data.achievements || data.achievements.length === 0) && (
              <p className="text-xs text-slate-500 text-center py-6">No honors recorded. Show off your competitive milestones!</p>
            )}

            <div className="space-y-4">
              {data.achievements?.map((ach) => (
                <div key={ach.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => deleteItem(data.achievements, ach.id, "achievements")}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-550 hover:bg-slate-100 rounded"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <div className="col-span-1 sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Achievement Title e.g. First place out of 500 in Global Fintech Hackathon"
                        value={ach.title || ""}
                        onChange={(e) => updateItemField(data.achievements, ach.id, "title", e.target.value, "achievements")}
                        className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Date Awarded e.g. Summer 2023"
                        value={ach.date || ""}
                        onChange={(e) => updateItemField(data.achievements, ach.id, "date", e.target.value, "achievements")}
                        className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Brief context details about the reward or selective criteria"
                      value={ach.description || ""}
                      onChange={(e) => updateItemField(data.achievements, ach.id, "description", e.target.value, "achievements")}
                      className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Section */}
        {activeTab === "custom" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Custom Sections</h3>
                <p className="text-xs text-slate-500">Add customizable sections like Volunteering, Publications, or Interests.</p>
              </div>
              <button
                type="button"
                onClick={addCustomSection}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-850 rounded-lg transition-colors"
              >
                <Plus size={12} />
                <span>Add Section</span>
              </button>
            </div>

            {(!data.customSections || data.customSections.length === 0) && (
              <p className="text-xs text-slate-500 text-center py-6">No custom detail sections. Useful for publications or hobbies.</p>
            )}

            <div className="space-y-4">
              {data.customSections?.map((sec) => (
                <div key={sec.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => deleteItem(data.customSections, sec.id, "customSections")}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-550 hover:bg-slate-100 rounded"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="pr-6">
                    <input
                      type="text"
                      placeholder="Section Title e.g. Community Work, Conferences"
                      value={sec.title || ""}
                      onChange={(e) => updateItemField(data.customSections, sec.id, "title", e.target.value, "customSections")}
                      className="w-full sm:w-1/2 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-slate-100 font-bold text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Add detailed paragraphs or Markdown style bullets here."
                      value={sec.content || ""}
                      onChange={(e) => updateItemField(data.customSections, sec.id, "content", e.target.value, "customSections")}
                      rows={4}
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
