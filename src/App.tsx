import { useRef, useState, useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import { useAuth } from "@/context/AuthContext";
import PersonalInfoForm from "@/components/form/PersonalInfoForm";
import EducationForm from "@/components/form/EducationForm";
import ExperienceForm from "@/components/form/ExperienceForm";
import ProjectsForm from "@/components/form/ProjectsForm";
import CertificationsForm from "@/components/form/CertificationsForm";
import SkillsForm from "@/components/form/SkillsForm";
import ResumePreview from "@/components/preview/ResumePreview";
import LoginModal from "@/components/auth/LoginModal";
import { Moon, Sun, LogIn, LogOut, Save, Loader2 } from "lucide-react";

export default function App() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode, resumeData, loadResumeData } = useResume();
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!user) return;
      setIsFetching(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/resume`, {
          headers: {
            'x-auth-token': localStorage.getItem('token') || ''
          }
        });
        if (res.ok) {
          const data = await res.json();
          loadResumeData(data);
        }
      } catch (err) {
        console.error('Failed to fetch resume', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchResume();
  }, [user]);

  const handleSave = async () => {
    if (!user) return setIsLoginModalOpen(true);
    
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/resume`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(resumeData)
      });
      if (!res.ok) throw new Error('Failed to save');
      // Optionally show a success toast
    } catch (err) {
      console.error(err);
      alert('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition-colors">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      {/* Left Panel: Forms */}
      <div className="w-full md:w-1/2 lg:w-[45%] h-screen overflow-y-auto p-6 lg:p-10 border-r border-gray-200 dark:border-gray-800 custom-scrollbar relative">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors text-sm font-medium"
              >
                <LogIn className="w-4 h-4" /> Login
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-2">AI Resume Builder</h1>
          <p className="text-gray-600 dark:text-gray-400">Fill in your details, let AI write your summary, and export to LaTeX / PDF.</p>
        </div>
        
        <PersonalInfoForm />
        <ExperienceForm />
        <ProjectsForm />
        <EducationForm />
        <CertificationsForm />
        <SkillsForm />
        
      </div>

      {/* Right Panel: Live Preview */}
      <div className="w-full md:w-1/2 lg:w-[55%] h-screen overflow-y-auto bg-gray-200 dark:bg-gray-950 relative">
        <ResumePreview ref={componentRef} />
      </div>
    </div>
  );
}
