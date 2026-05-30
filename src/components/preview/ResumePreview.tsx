import { forwardRef, useState, useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import { FileCode2, ExternalLink, Loader2, Download } from "lucide-react";
import { generateLatex } from "@/utils/latexGenerator";

const ResumePreview = forwardRef<HTMLDivElement, any>((_, ref) => {
  const { resumeData } = useResume();
  const latexCode = generateLatex(resumeData);
  
  const [pdfUrl, setPdfUrl] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [key, setKey] = useState(0);

  // Debounce the compilation to avoid spamming the free API
  useEffect(() => {
    setIsCompiling(true);
    const handler = setTimeout(() => {
      setPdfUrl(`https://latexonline.cc/compile?text=${encodeURIComponent(latexCode)}`);
      setIsCompiling(false);
    }, 2000);
    return () => clearTimeout(handler);
  }, [latexCode]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
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
    <div className="w-full flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <h2 className="font-semibold text-sm flex items-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <FileCode2 className="w-4 h-4" />
          Preview
          {isCompiling && <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-500" />}
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadPdf}
            disabled={isDownloading || !pdfUrl}
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
            title="Download PDF"
          >
            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden" ref={ref}>
        {pdfUrl ? (
          <div className="w-full h-full bg-white">
            <iframe 
              key={key}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="w-full h-full border-0"
              title="Resume PDF Preview"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
             <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">Compiling document...</p>
          </div>
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;