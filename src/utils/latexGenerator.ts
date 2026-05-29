import { ResumeData } from "@/context/ResumeContext";

export const generateLatex = (data: ResumeData): string => {
  const { personalInfo, education, experience, skills } = data;

  const escapeLatex = (str: string) => {
    if (!str) return "";
    return str
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      .replace(/\$/g, "\\$")
      .replace(/&/g, "\\&")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/%/g, "\\%")
      .replace(/~/g, "\\~")
      .replace(/\^/g, "\\textasciicircum{}");
  };

  const linksLatex = data.customLinks
    ?.filter((link) => link.name && link.url)
    .map((link) => `\\href{${link.url}}{${escapeLatex(link.name)}}`)
    .join(" $|$ ") || "";

  return `\\documentclass[a4paper,10.5pt]{article}

\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personalInfo.firstName)} ${escapeLatex(personalInfo.lastName)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personalInfo.phone)} $|$ \\href{mailto:${personalInfo.email}}{${escapeLatex(personalInfo.email)}} $|$ 
    ${personalInfo.linkedin ? `\\href{${personalInfo.linkedin}}{LinkedIn}` : ""} $|$
    ${personalInfo.github ? `\\href{${personalInfo.github}}{GitHub}` : ""}
    ${linksLatex ? `$|$ ${linksLatex}` : ""}
\\end{center}

${personalInfo.objective ? `
\\section{Professional Summary}
${escapeLatex(personalInfo.objective)}
` : ""}

${experience.length > 0 ? `
\\section{Experience}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${experience.map(exp => `
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(exp.position)}} & ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)} \\\\
        \\textit{${escapeLatex(exp.company)}} \\\\
      \\end{tabular*}\\vspace{-5pt}
      \\begin{itemize}
        \\item ${escapeLatex(exp.description).replace(/\\n/g, '\\\\')}
      \\end{itemize}
    `).join('')}
  \\end{itemize}
` : ""}

${education.length > 0 ? `
\\section{Education}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${education.map(edu => `
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(edu.school)}} & ${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)} \\\\
        \\textit{${escapeLatex(edu.degree)}} \\\\
      \\end{tabular*}\\vspace{-5pt}
      \\begin{itemize}
        \\item ${escapeLatex(edu.description).replace(/\\n/g, '\\\\')}
      \\end{itemize}
    `).join('')}
  \\end{itemize}
` : ""}

${skills.length > 0 ? `
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\item{
     \\textbf{Skills}{: ${skills.map(s => escapeLatex(s.name)).join(', ')}}
    }
 \\end{itemize}
` : ""}

\\end{document}
`;
};
