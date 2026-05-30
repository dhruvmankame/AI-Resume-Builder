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
import AuthPage from "@/components/auth/AuthPage";
import { Moon, Sun, LogOut, Save, Loader2 } from "lucide-react";

export default function App() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode, resumeData, loadResumeData, resetToTemplate, resetToEmpty } = useResume();
  const { user, logout, loading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!user) {
        setIsFetching(false);
        setIsLoaded(false);
        resetToEmpty(); // Clear data when logged out
        return;
      }
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
        } else if (res.status === 404) {
          // New user - load the professional template
          resetToTemplate();
        }
      } catch (err) {
        console.error('Failed to fetch resume', err);
      } finally {
        setIsFetching(false);
        setIsLoaded(true);
      }
    };
    fetchResume();
  }, [user]);

  // Debounced Auto-save to MongoDB
  useEffect(() => {
    if (!user || !isLoaded || isFetching) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/resume`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || ''
          },
          body: JSON.stringify(resumeData)
        });
      } catch (err) {
        console.error('Auto-save failed', err);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [resumeData, user, isLoaded, isFetching]);

  if (authLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Left Panel: Forms */}
      <div className="w-full md:w-1/2 lg:w-[45%] h-screen overflow-y-auto p-6 lg:p-10 border-r border-gray-200 dark:border-gray-800 custom-scrollbar relative">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isSaving && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
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
