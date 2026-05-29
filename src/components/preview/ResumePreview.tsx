import { forwardRef, useState, useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import { FileCode2, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { generateLatex } from "@/utils/latexGenerator";

const ResumePreview = forwardRef<HTMLDivElement, any>((_, ref) => {
  const { resumeData } = useResume();
  const latexCode = generateLatex(resumeData);
  
  const [pdfUrl, setPdfUrl] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
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

  return (
    <div className="w-full flex flex-col h-full bg-gray-200 dark:bg-gray-900 transition-colors">
      <div className="sticky top-0 z-10 w-full bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-md flex justify-between items-center px-4 sm:px-8">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-blue-400" />
          <span className="hidden sm:inline">LaTeX PDF Preview</span>
          <span className="sm:hidden">Preview</span>
          {isCompiling && <Loader2 className="w-4 h-4 ml-1 animate-spin text-gray-400" />}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setIsCompiling(true);
              setPdfUrl(`https://latexonline.cc/compile?text=${encodeURIComponent(latexCode)}`);
              setKey(k => k + 1);
              setTimeout(() => setIsCompiling(false), 500);
            }}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors font-medium shadow-sm text-xs sm:text-sm"
            title="Force refresh the PDF preview"
          >
            <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <form action="https://www.overleaf.com/docs" method="post" target="_blank">
            <input type="hidden" name="snip" value={latexCode} />
            <button 
              type="submit"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors font-medium shadow-sm text-xs sm:text-sm"
              title="Open and edit directly in Overleaf"
            >
              <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">Overleaf</span>
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex-1 p-2 sm:p-6 lg:p-8 relative" ref={ref}>
        {pdfUrl ? (
          <iframe 
            key={key}
            src={pdfUrl} 
            className="w-full h-full rounded-md shadow-2xl border-0 bg-white"
            title="Resume PDF Preview"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md shadow-xl">
             <Loader2 className="w-8 h-8 animate-spin text-gray-500 mb-4" />
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Compiling LaTeX document...</p>
          </div>
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
