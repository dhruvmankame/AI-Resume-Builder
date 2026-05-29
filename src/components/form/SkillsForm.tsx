import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { Plus } from "lucide-react";

export default function SkillsForm() {
  const { resumeData, addSkill, removeSkill } = useResume();
  const { skills } = resumeData;
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (skillInput.trim()) {
      addSkill(skillInput);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Skills</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add a Skill</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={skillInput} 
            onChange={(e) => setSkillInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder="e.g. JavaScript, Project Management"
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          />
          <button 
            type="button"
            onClick={handleAddSkill}
            className="flex items-center justify-center bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-4 rounded-md transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full flex items-center text-sm transition-colors">
            <span>{skill.name}</span>
            <button 
              onClick={() => removeSkill(skill.id)}
              className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}