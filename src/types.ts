export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  jobTitle: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  link: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // 'Beginner' | 'Intermediate' | 'Expert' | ''
  category: string; // e.g. 'Frontend', 'Backend', 'Tools', 'Soft Skills'
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // 'Basic' | 'Conversational' | 'Fluent' | 'Native' | ''
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  id?: string;
  templateId: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  customSections: CustomSection[];
}

export interface ATSReport {
  score: number;
  grammarIssues: string[];
  missingKeywords: string[];
  positives: string[];
  improvements: string[];
  recommendedSkills: string[];
}

export interface KeywordMatchReport {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  evaluationSummary: string[];
  roleRelevance: string;
}

export interface VersionInfo {
  id: string;
  timestamp: string;
  label: string;
  resumeData: ResumeData;
}
