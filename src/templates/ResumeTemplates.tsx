import React from "react";
import { ResumeData } from "../types";

interface TemplateProps {
  data: ResumeData;
}

// 1. MODERN EXECUTIVE TEMPLATE (Clean layouts, elegant sans-serif, slate/indigo accents)
export const ModernExecutive: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experiences, projects, education, skills, certifications, languages, achievements, customSections } = data;

  return (
    <div id="resume-container-print" className="p-8 sm:p-12 bg-white text-slate-800 font-sans leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto shadow-sm print:shadow-none">
      {/* Header */}
      <div className="border-b-2 border-indigo-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">{personalInfo?.fullName || "Your Name"}</h1>
        <p className="text-lg font-medium text-indigo-600 mb-3">{personalInfo?.jobTitle || "Professional Title"}</p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {personalInfo?.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo?.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo?.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>🔗 LinkedIn: {personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>💻 GitHub: {personalInfo.github}</span>}
          {personalInfo?.website && <span>🌐 Web: {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm text-slate-700 whitespace-pre-line">{summary}</p>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left main: Experiences & Projects */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-3">Professional Experience</h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id || Math.random().toString()} className="text-sm">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <h4>{exp.position}</h4>
                      <span className="text-xs text-slate-500 font-normal">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-600 font-medium mb-1">{exp.company}</div>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-3">Key Projects</h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id || Math.random().toString()} className="text-sm">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <h4>{proj.name}</h4>
                      <span className="text-xs text-slate-500 font-normal">
                        {proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ""}
                      </span>
                    </div>
                    {proj.role && <div className="text-xs text-slate-600 italic mb-1">{proj.role}</div>}
                    <p className="text-xs text-slate-700 whitespace-pre-line mb-1">{proj.description}</p>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">
                        🔗 Project Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Education, Skills, Languages... */}
        <div className="space-y-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-3">Core Expertise</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill.id || Math.random().toString()} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                    {skill.name} {skill.level ? `(${skill.level})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-3">Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id || Math.random().toString()} className="text-xs">
                    <div className="font-semibold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</div>
                    <div className="text-slate-600">{edu.school}</div>
                    <div className="text-slate-500">{edu.startDate} - {edu.endDate} {edu.grade ? `| GPA: ${edu.grade}` : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-2">Certifications</h2>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                {certifications.map((cert) => (
                  <li key={cert.id || Math.random().toString()}>
                    <span className="font-semibold">{cert.name}</span> — <span className="text-slate-500">{cert.issuer} ({cert.date})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-2">Languages</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {languages.map((lang) => (
                  <div key={lang.id || Math.random().toString()} className="text-slate-700">
                    <span className="font-semibold">{lang.name}</span>: <span className="text-slate-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-2">Honors & Achievements</h2>
              <div className="space-y-2 text-xs">
                {achievements.map((ach) => (
                  <div key={ach.id || Math.random().toString()}>
                    <div className="font-semibold text-slate-900">{ach.title} ({ach.date})</div>
                    <div className="text-slate-600">{ach.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 col-span-full">
          {customSections.map((sec) => (
            <div key={sec.id || Math.random().toString()} className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 pb-1 mb-2">{sec.title}</h2>
              <p className="text-xs text-slate-700 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. CREATIVE MONO SPACE (Tech/Modern Brutalist, ideal for programmers/technical roles)
export const CreativeMono: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experiences, projects, education, skills, certifications, languages, achievements, customSections } = data;

  return (
    <div id="resume-container-print" className="p-8 sm:p-12 bg-zinc-50 text-zinc-900 font-mono leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto border-2 border-zinc-900 shadow-sm print:border-none print:shadow-none">
      {/* Header */}
      <div className="border-b-4 border-zinc-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight uppercase mb-1">&gt; {personalInfo?.fullName || "YOUR NAME"}</h1>
        <p className="text-sm text-zinc-600 mb-4">[ {personalInfo?.jobTitle || "ROLE_OR_TARGET_FIELD"} ]</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-zinc-600 border-t border-dashed border-zinc-400 pt-3">
          {personalInfo?.email && <div>$ CONTACT: {personalInfo.email}</div>}
          {personalInfo?.phone && <div>$ PHONE: {personalInfo.phone}</div>}
          {personalInfo?.location && <div>$ LOCATION: {personalInfo.location}</div>}
          {personalInfo?.linkedin && <div>$ LINKEDIN: {personalInfo.linkedin}</div>}
          {personalInfo?.github && <div>$ GITHUB: {personalInfo.github}</div>}
          {personalInfo?.website && <div>$ WEB: {personalInfo.website}</div>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6 border border-zinc-300 p-3 bg-zinc-100">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-2"># SUMMARY</h2>
          <p className="text-xs whitespace-pre-line">{summary}</p>
        </div>
      )}

      {/* Experiences */}
      {experiences && experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-3"># WORK_EXPERIENCE</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-xs border-l-2 border-zinc-900 pl-3">
                <div className="flex justify-between items-center font-bold">
                  <span>{exp.position} @ {exp.company}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">{exp.startDate} - {exp.current ? "PRESENT" : exp.endDate}</span>
                </div>
                <p className="mt-1 text-zinc-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-3"># KEY_PROJECTS</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs border-l-2 border-zinc-900 pl-3">
                <div className="flex justify-between items-center font-bold">
                  <span>{proj.name} {proj.role ? `[${proj.role}]` : ""}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">{proj.startDate} - {proj.endDate}</span>
                </div>
                <p className="mt-1 text-zinc-700 whitespace-pre-line">{proj.description}</p>
                {proj.link && <div className="mt-1 font-bold text-zinc-900">&gt;_ url: <a href={proj.link} target="_blank" rel="noreferrer" className="underline">{proj.link}</a></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-3"># SKILLS_AND_TECH</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {skills.map((skill) => (
              <span key={skill.id} className="bg-zinc-200 px-2 py-0.5 border border-zinc-300">
                {skill.name} {skill.level ? `[${skill.level}]` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-3"># EDUCATION</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold">{edu.degree} in {edu.fieldOfStudy}</div>
                <div className="text-zinc-600">{edu.school} | {edu.startDate} - {edu.endDate} {edu.grade ? `(GPA: ${edu.grade})` : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two column split for languages and achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-2"># LANGUAGES</h2>
            <ul className="text-xs space-y-1 list-none pl-0">
              {languages.map((lang) => (
                <li key={lang.id}>- {lang.name}: {lang.proficiency || "Fluent"}</li>
              ))}
            </ul>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-2"># CERTIFICATIONS</h2>
            <ul className="text-xs space-y-1 list-none pl-0">
              {certifications.map((cert) => (
                <li key={cert.id}>- {cert.name} ({cert.issuer}, {cert.date})</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {customSections && customSections.length > 0 && (
        <div className="border-t border-dashed border-zinc-400 pt-4">
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 inline-block mb-2"># {sec.title.toUpperCase().replace(/\s+/g, '_')}</h2>
              <p className="text-xs whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. CLASSIC SERIF (Elegant, Black & White Editorial, suitable for academia, law, medicine, finance)
export const ClassicSerif: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experiences, projects, education, skills, certifications, languages, achievements, customSections } = data;

  return (
    <div id="resume-container-print" className="p-8 sm:p-12 bg-white text-slate-950 font-serif leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto shadow-sm print:shadow-none">
      {/* Centered Large Header */}
      <div className="text-center pb-6 mb-6 border-b border-slate-300">
        <h1 className="text-4xl font-normal text-slate-900 tracking-wide mb-1 italic font-serif">{personalInfo?.fullName || "Your Name"}</h1>
        <p className="text-sm font-semibold tracking-widest uppercase text-slate-600 mb-4">{personalInfo?.jobTitle || "Target Discipline"}</p>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 italic">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo?.location && <span>• {personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>• LinkedIn: {personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>• GitHub: {personalInfo.github}</span>}
          {personalInfo?.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6 text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2">About</h2>
          <p className="text-sm text-slate-800 leading-relaxed font-serif">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">Experience</h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-sm">
                <div className="flex justify-between items-baseline font-semibold">
                  <div>
                    <span className="text-slate-900">{exp.position}</span>, <span className="font-normal italic text-slate-700">{exp.company}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-normal italic">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-slate-800 mt-1.5 whitespace-pre-line leading-relaxed pl-3 border-l border-slate-200">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">Selected Projects</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="text-sm">
                <div className="flex justify-between items-baseline font-semibold">
                  <span>{proj.name} {proj.role ? `— ${proj.role}` : ""}</span>
                  <span className="text-xs text-slate-500 font-normal italic">
                    {proj.startDate} – {proj.endDate}
                  </span>
                </div>
                <p className="text-xs text-slate-800 mt-1 pl-3 border-l border-slate-200">{proj.description}</p>
                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-slate-500 underline ml-3 italic">View Work ({proj.link})</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-sm">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">{edu.school}</span>
                  <span className="text-xs text-slate-500 italic">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-xs text-slate-700 italic">{edu.degree} in {edu.fieldOfStudy} {edu.grade ? `(GPA: ${edu.grade})` : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-2">Areas of Expertise</h2>
          <p className="text-xs text-slate-800 italic leading-relaxed">
            {skills.map((skill, index) => (
              <span key={skill.id}>
                {skill.name} {skill.level ? `(${skill.level})` : ""}{index < skills.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Extra categories in columns if they exist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {certifications && certifications.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-1 mb-2">Qualifications</h3>
            <ul className="list-disc pl-4 text-xs text-slate-800 space-y-1">
              {certifications.map((cert) => (
                <li key={cert.id}>{cert.name} — {cert.issuer} ({cert.date})</li>
              ))}
            </ul>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-1 mb-2">Languages</h3>
            <div className="text-xs text-slate-800 italic space-y-1">
              {languages.map((lang) => (
                <div key={lang.id}>{lang.name}: {lang.proficiency}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {customSections && customSections.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-300">
          {customSections.map((sec) => (
            <div key={sec.id} className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-2">{sec.title}</h2>
              <p className="text-xs text-slate-800 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Export Component that dynamic dispatches template rendering
export const DynamicResume: React.FC<{ data: ResumeData; templateId: string }> = ({ data, templateId }) => {
  switch (templateId) {
    case "creative":
    case "mono":
      return <CreativeMono data={data} />;
    case "serif":
    case "classic":
      return <ClassicSerif data={data} />;
    case "modern":
    default:
      return <ModernExecutive data={data} />;
  }
};
