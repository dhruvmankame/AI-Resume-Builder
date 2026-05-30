import { forwardRef, useState, useRef, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import { FileCode2, Download, Loader2 } from "lucide-react";
import { generateLatex } from "@/utils/latexGenerator";
import HtmlResumeMirror from "./HtmlResumeMirror";

const ResumePreview = forwardRef<HTMLDivElement, any>((_, ref) => {
  const { resumeData, cachedPdfUrl, isPdfCompiling: contextCompiling } = useResume();
  const [isDownloading, setIsDownloading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(async () => {
    // If we have a cached URL from the background pre-fetch, use it for instant download
    if (cachedPdfUrl) {
      const firstName = resumeData.personalInfo.firstName.trim();
      const filename = firstName ? `${firstName}_resume.pdf` : 'resume.pdf';

      const a = document.createElement("a");
      a.href = cachedPdfUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Fallback to manual download if cache isn't ready
    setIsDownloading(true);
    try {
      const latexCode = generateLatex(resumeData);
      if (!latexCode) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/resume/download-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode })
      });

      if (!response.ok) throw new Error('PDF compilation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const firstName = resumeData.personalInfo.firstName.trim();
      const filename = firstName ? `${firstName}_resume.pdf` : 'resume.pdf';

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [resumeData, cachedPdfUrl]);

  const isLoading = isDownloading || (contextCompiling && !cachedPdfUrl);

  return (
    <div className="w-full flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Toolbar */}
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <h2 className="font-semibold text-sm flex items-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <FileCode2 className="w-4 h-4 text-blue-500" />
          Live Preview
        </h2>
        <div className="flex gap-4">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-30 font-medium text-sm"
            title="Download as LaTeX-compiled PDF"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isLoading ? "Preparing PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Live HTML Preview */}
      <div className="flex-1 overflow-auto bg-gray-300 dark:bg-gray-950" ref={ref}>
        <div ref={scrollRef} className="py-8 flex justify-center min-h-full">
          <HtmlResumeMirror />
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
