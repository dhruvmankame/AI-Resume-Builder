import { useResume } from "@/context/ResumeContext";
import { Plus, Trash2 } from "lucide-react";

export default function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const { experience } = resumeData;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Experience</h2>
        <button 
          onClick={addExperience}
          className="flex items-center text-sm bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
      </div>

      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="relative p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 transition-colors">
            {experience.length > 1 && (
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                title="Remove Experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="md:col-span-2 pr-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company / Organization</label>
                <input 
                  type="text" 
                  value={exp.company} 
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })} 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position / Title</label>
                <input 
                  type="text" 
                  value={exp.position} 
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })} 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input 
                  type="text" 
                  value={exp.startDate} 
                  placeholder="e.g. Jan 2022"
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input 
                  type="text" 
                  value={exp.endDate} 
                  placeholder="e.g. Present"
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  value={exp.description} 
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })} 
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}