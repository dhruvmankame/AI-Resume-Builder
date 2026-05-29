import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface CustomLink {
  id: string;
  name: string;
  url: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  objective: string;
  title: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  customLinks: CustomLink[];
}

interface ResumeContextType {
  resumeData: ResumeData;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addEducation: () => void;
  updateEducation: (id: string, info: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, info: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addSkill: (name: string) => void;
  removeSkill: (id: string) => void;
  addCustomLink: () => void;
  updateCustomLink: (id: string, info: Partial<CustomLink>) => void;
  removeCustomLink: (id: string) => void;
}

const defaultPersonalInfo: PersonalInfo = {
  firstName: "Rahul",
  lastName: "Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  address: "Bengaluru, Karnataka",
  linkedin: "linkedin.com/in/rahulsharma",
  github: "github.com/rahulsharma",
  objective: "A highly motivated software engineer looking to build scalable web applications. Passionate about solving complex problems and learning new technologies.",
  title: "Software Engineer",
};

const defaultResumeData: ResumeData = {
  personalInfo: defaultPersonalInfo,
  education: [
    {
      id: uuidv4(),
      school: "Indian Institute of Technology (IIT)",
      degree: "B.Tech in Computer Science and Engineering",
      startDate: "2019",
      endDate: "2023",
      description: "Graduated with First Class Honors. Coursework included Data Structures, Algorithms, and Distributed Systems.",
    },
  ],
  experience: [
    {
      id: uuidv4(),
      company: "Tech Mahindra",
      position: "Software Developer",
      startDate: "2023",
      endDate: "Present",
      description: "Developed and maintained user-facing features using React and Node.js. Improved application performance by 20%.",
    },
  ],
  skills: [
    { id: uuidv4(), name: "JavaScript / TypeScript" },
    { id: uuidv4(), name: "React.js" },
    { id: uuidv4(), name: "Node.js" },
    { id: uuidv4(), name: "MongoDB" },
    { id: uuidv4(), name: "Git & CI/CD" },
  ],
  customLinks: [
    { id: uuidv4(), name: "Portfolio", url: "https://rahulsharma.dev" }
  ]
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: uuidv4(), school: "", degree: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const updateEducation = (id: string, info: Partial<Education>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...info } : edu)),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: uuidv4(), company: "", position: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const updateExperience = (id: string, info: Partial<Experience>) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, ...info } : exp)),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addSkill = (name: string) => {
    if (!name.trim()) return;
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, { id: uuidv4(), name: name.trim() }],
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const addCustomLink = () => {
    setResumeData((prev) => ({
      ...prev,
      customLinks: [
        ...prev.customLinks,
        { id: uuidv4(), name: "", url: "" },
      ],
    }));
  };

  const updateCustomLink = (id: string, info: Partial<CustomLink>) => {
    setResumeData((prev) => ({
      ...prev,
      customLinks: prev.customLinks.map((link) => (link.id === id ? { ...link, ...info } : link)),
    }));
  };

  const removeCustomLink = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      customLinks: prev.customLinks.filter((link) => link.id !== id),
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        isDarkMode,
        toggleDarkMode,
        updatePersonalInfo,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        addSkill,
        removeSkill,
        addCustomLink,
        updateCustomLink,
        removeCustomLink
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};