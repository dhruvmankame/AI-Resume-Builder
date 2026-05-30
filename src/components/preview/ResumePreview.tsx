import { forwardRef, useState, useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import { FileCode2, Download, Loader2 } from "lucide-react";
import { generateLatex } from "@/utils/latexGenerator";

const ResumePreview = forwardRef<HTMLDivElement, any>((_, ref) => {
  const { resumeData } = useResume();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // High-performance background compilation via backend proxy (avoids GET limits)
  useEffect(() => {
    let currentObjectURL = "";

    const compilePdf = async () => {
      const latexCode = generateLatex(resumeData);
      if (!latexCode) return;

      setIsCompiling(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/resume/download-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latexCode })
        });

        if (!response.ok) throw new Error('Preview compilation failed');

        const blob = await response.blob();
        const newObjectURL = URL.createObjectURL(blob);
        
        if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
        
        currentObjectURL = newObjectURL;
        setPdfUrl(newObjectURL);
      } catch (error) {
        console.error("Live preview error:", error);
      } finally {
        setIsCompiling(false);
      }
    };

    // Optimization: Skip debounce if it's the very first load
    if (!pdfUrl) {
      compilePdf();
      return;
    }

    // Debounce for subsequent changes
    const timer = setTimeout(compilePdf, 1500);

    return () => {
      clearTimeout(timer);
      if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
    };
  }, [resumeData]);

  const handleDownloadPdf = async () => {
    if (!pdfUrl) return;
    setIsDownloading(true);
    try {
      const firstName = resumeData.personalInfo.firstName.trim();
      const filename = firstName ? `${firstName}_resume.pdf` : 'resume.pdf';
      
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Professional Minimal Toolbar */}
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <h2 className="font-semibold text-sm flex items-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <FileCode2 className="w-4 h-4 text-blue-500" />
          Real-Time LaTeX PDF
          {isCompiling && <Loader2 className="w-3.5 h-3.5 ml-1 animate-spin text-blue-500" />}
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadPdf}
            disabled={!pdfUrl || isDownloading}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-30 font-medium text-sm"
            title="Download Professional PDF"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden bg-gray-200 dark:bg-gray-950" ref={ref}>
        {/* Ghost Loading Effect: Keep previous PDF visible but dim it while compiling */}
        <div className={`w-full h-full transition-opacity duration-500 ${isCompiling ? 'opacity-40 grayscale-[50%]' : 'opacity-100'}`}>
          {pdfUrl ? (
            <iframe 
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="w-full h-full border-0"
              title="Resume PDF Preview"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 border-0">
               <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
               <p className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">Initializing LaTeX Preview...</p>
            </div>
          )}
        </div>

        {/* Floating status indicator when compiling in background */}
        {isCompiling && pdfUrl && (
          <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Updating PDF...
          </div>
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
