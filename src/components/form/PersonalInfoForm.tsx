import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { Sparkles, Loader2, Plus, Trash2 } from "lucide-react";
import { generateSummary } from "@/utils/ai";

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo, addCustomLink, updateCustomLink, removeCustomLink } = useResume();
  const { personalInfo, skills, experience, customLinks } = resumeData;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const summary = await generateSummary(
        personalInfo.title,
        skills.map((s) => s.name),
        experience.map((e) => `${e.position} at ${e.company}`).join(", ")
      );

      updatePersonalInfo({ objective: summary });
    } catch (error) {
      console.error(error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-2">Personal Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
          <input type="text" name="firstName" value={personalInfo.firstName} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
          <input type="text" name="lastName" value={personalInfo.lastName} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
          <input type="text" name="title" value={personalInfo.title} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input type="email" name="email" value={personalInfo.email} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
          <input type="text" name="phone" value={personalInfo.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
          <input type="text" name="address" value={personalInfo.address} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
          <input type="text" name="linkedin" value={personalInfo.linkedin} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
          <input type="text" name="github" value={personalInfo.github} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>

        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-center mb-3">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Custom Links (Optional)</label>
             <button 
                onClick={addCustomLink}
                className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md transition-colors font-medium"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Link
              </button>
           </div>
           
           {customLinks?.map((link) => (
             <div key={link.id} className="flex gap-2 mb-2 items-center">
               <input 
                  type="text" 
                  placeholder="Link Name (e.g. Portfolio)" 
                  value={link.name} 
                  onChange={(e) => updateCustomLink(link.id, { name: e.target.value })} 
                  className="w-1/3 p-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
               <input 
                  type="text" 
                  placeholder="URL (e.g. https://...)" 
                  value={link.url} 
                  onChange={(e) => updateCustomLink(link.id, { url: e.target.value })} 
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
               <button 
                  onClick={() => removeCustomLink(link.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
        
        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professional Summary</label>
            <button 
              onClick={handleGenerateSummary} 
              disabled={isGenerating}
              className="flex items-center text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-md transition-colors font-medium disabled:opacity-50 border border-blue-200 dark:border-blue-800"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
              AI Write
            </button>
          </div>
          <textarea 
            name="objective" 
            value={personalInfo.objective} 
            onChange={handleChange} 
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            placeholder="Write a brief professional summary or let AI generate one for you..."
          />
        </div>
      </div>
    </div>
  );
}
