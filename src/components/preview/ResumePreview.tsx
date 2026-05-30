import { forwardRef, useState, useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import { FileCode2, ExternalLink, Loader2, Download } from "lucide-react";
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
    <div className="w-full flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <h2 className="font-semibold text-sm flex items-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <FileCode2 className="w-4 h-4" />
          Preview
          {isCompiling && <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-500" />}
        </h2>
        <div className="flex gap-4">
          <a 
            href={pdfUrl}
            download="resume.pdf"
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </a>

          <form action="https://www.overleaf.com/docs" method="post" target="_blank" className="flex items-center">
            <input type="hidden" name="snip" value={latexCode} />
            <button 
              type="submit"
              className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
              title="Open and edit directly in Overleaf"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex-1 p-4 sm:p-8 relative overflow-y-auto" ref={ref}>
        {pdfUrl ? (
          <div className="h-full max-w-[210mm] mx-auto bg-white shadow-2xl rounded-sm">
            <iframe 
              key={key}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 rounded-sm"
              title="Resume PDF Preview"
            />
          </div>
        ) : (
          <div className="w-full h-full max-w-[210mm] mx-auto flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-2xl rounded-sm border border-gray-200 dark:border-gray-700">
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
