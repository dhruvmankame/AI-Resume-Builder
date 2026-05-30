import { useResume } from "@/context/ResumeContext";
import { Plus, Trash2 } from "lucide-react";

export default function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResume();
  const { certifications } = resumeData;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Certifications & Awards</h2>
        <button 
          onClick={addCertification}
          className="flex items-center text-sm bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="relative p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 transition-colors">
            <button 
              onClick={() => removeCertification(cert.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
              title="Remove Certification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="md:col-span-2 pr-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certification / Award Name</label>
                <input 
                  type="text" 
                  value={cert.name} 
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })} 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issuing Organization</label>
                <input 
                  type="text" 
                  value={cert.issuer} 
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input 
                  type="text" 
                  value={cert.date} 
                  placeholder="e.g. Aug 2023"
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })} 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}