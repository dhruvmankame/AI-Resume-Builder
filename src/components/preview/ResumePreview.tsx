import { forwardRef, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { FileCode2, Download, Loader2 } from "lucide-react";
import { generateLatex } from "@/utils/latexGenerator";

const ResumePreview = forwardRef<HTMLDivElement, any>((_, ref) => {
  const { resumeData } = useResume();
  const { personalInfo, education, experience, projects, certifications, skills, customLinks } = resumeData;
  const [isDownloading, setIsDownloading] = useState(false);

  // Instant filtering logic for the live mirror
  const validExperience = experience.filter(exp => exp.company?.trim() || exp.position?.trim());
  const validEducation = education.filter(edu => edu.school?.trim() || edu.degree?.trim());
  const validProjects = projects.filter(proj => proj.name?.trim());
  const validCertifications = certifications.filter(cert => cert.name?.trim());
  const validSkills = skills.filter(skill => skill.name?.trim());

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const latexCode = generateLatex(resumeData);
      const firstName = resumeData.personalInfo.firstName.trim();
      const filename = firstName ? `${firstName}_resume.pdf` : 'resume.pdf';

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/resume/download-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode, filename })
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-gray-900 transition-colors">
      {/* Professional Minimal Toolbar */}
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <h2 className="font-bold text-xs flex items-center gap-2 text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <FileCode2 className="w-4 h-4" />
          Live LaTeX Mirror
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-50 font-semibold text-sm"
            title="Download Professional PDF"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>
      
      {/* THE INSTANT MIRROR (No Iframe delay) */}
      <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-950 flex justify-center p-0 transition-all duration-300">
        <div 
          ref={ref} 
          className="bg-white text-black shadow-2xl origin-top" 
          style={{ 
            width: "210mm", 
            minHeight: "297mm",
            padding: "15mm 20mm",
            fontFamily: "'Times New Roman', Times, serif",
            lineHeight: "1.2"
          }}
        >
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-[24pt] font-bold uppercase mb-0.5 tracking-tight" style={{ fontVariant: "small-caps" }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className="text-[10pt] flex flex-wrap justify-center gap-x-2">
              {personalInfo.phone && <span>{personalInfo.phone} |</span>}
              {personalInfo.email && <span className="text-blue-800 underline">{personalInfo.email}</span>}
              {personalInfo.linkedin && <span>| <span className="text-blue-800 underline">LinkedIn</span></span>}
              {personalInfo.github && <span>| <span className="text-blue-800 underline">GitHub</span></span>}
              {customLinks?.map((link) => (
                <span key={link.id}>| <span className="text-blue-800 underline">{link.name}</span></span>
              ))}
            </div>
          </div>

          {/* Professional Summary */}
          {personalInfo.objective?.trim() && (
            <div className="mb-4">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-1.5 tracking-wide" style={{ fontVariant: "small-caps" }}>Professional Summary</h2>
              <p className="text-[10.5pt] text-justify">{personalInfo.objective}</p>
            </div>
          )}

          {/* Experience */}
          {validExperience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 tracking-wide" style={{ fontVariant: "small-caps" }}>Experience</h2>
              <div className="space-y-3">
                {validExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between font-bold text-[10.5pt]">
                      <span>{exp.position}</span>
                      <span>{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-[10.5pt] italic mb-1">{exp.company}</div>
                    <ul className="list-disc list-inside text-[10pt] pl-1 space-y-0.5">
                      {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} className="leading-tight text-justify pl-1 -indent-5 ml-5">{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {validProjects.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 tracking-wide" style={{ fontVariant: "small-caps" }}>Projects</h2>
              <div className="space-y-3">
                {validProjects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between font-bold text-[10.5pt]">
                      <span>{proj.name} {proj.technologies && <span className="font-normal text-[9pt] ml-2">| {proj.technologies}</span>}</span>
                      <span>{proj.startDate} – {proj.endDate}</span>
                    </div>
                    {proj.url && <div className="text-[9.5pt] italic text-blue-800 underline mb-0.5">{proj.url}</div>}
                    <ul className="list-disc list-inside text-[10pt] pl-1 space-y-0.5">
                      {proj.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} className="leading-tight text-justify pl-1 -indent-5 ml-5">{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {validEducation.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 tracking-wide" style={{ fontVariant: "small-caps" }}>Education</h2>
              <div className="space-y-3">
                {validEducation.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between font-bold text-[10.5pt]">
                      <span>{edu.school}</span>
                      <span>{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <div className="text-[10.5pt] italic">{edu.degree}</div>
                    {edu.description?.trim() && <p className="text-[10pt] mt-0.5">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {validCertifications.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 tracking-wide" style={{ fontVariant: "small-caps" }}>Certifications & Awards</h2>
              <div className="space-y-1.5">
                {validCertifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-[10.5pt]">
                    <span><span className="font-bold">{cert.name}</span>, {cert.issuer}</span>
                    <span className="font-medium text-[10pt]">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {validSkills.length > 0 && (
            <div>
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-1.5 tracking-wide" style={{ fontVariant: "small-caps" }}>Technical Skills</h2>
              <div className="text-[10.5pt] leading-snug">
                <span className="font-bold uppercase text-[9.5pt]">Skills: </span>
                {validSkills.map(s => s.name).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;