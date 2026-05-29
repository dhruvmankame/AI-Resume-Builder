import { useRef } from "react";
import { useResume } from "@/context/ResumeContext";
import PersonalInfoForm from "@/components/form/PersonalInfoForm";
import EducationForm from "@/components/form/EducationForm";
import ExperienceForm from "@/components/form/ExperienceForm";
import SkillsForm from "@/components/form/SkillsForm";
import ResumePreview from "@/components/preview/ResumePreview";
import { Moon, Sun } from "lucide-react";

export default function App() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode } = useResume();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Left Panel: Forms */}
      <div className="w-full md:w-1/2 lg:w-[45%] h-screen overflow-y-auto p-6 lg:p-10 border-r border-gray-200 dark:border-gray-800 custom-scrollbar">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-2">AI Resume Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">Fill in your details, let AI write your summary, and export to LaTeX / PDF.</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <PersonalInfoForm />
        <ExperienceForm />
        <EducationForm />
        <SkillsForm />
        
      </div>

      {/* Right Panel: Live Preview */}
      <div className="w-full md:w-1/2 lg:w-[55%] h-screen overflow-y-auto bg-gray-200 dark:bg-gray-950 relative">
        <ResumePreview ref={componentRef} />
      </div>
    </div>
  );
}
