import { ResumeData } from "@/context/ResumeContext";

export const generateLatex = (data: ResumeData): string => {
  const { personalInfo, education, experience, projects, certifications, skills } = data;

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

  const ensureProtocol = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const linksLatex = data.customLinks
    ?.filter((link) => link.name && link.url)
    .map((link) => `\\href{${ensureProtocol(link.url)}}{${escapeLatex(link.name)}}`)
    .join(" $|$ ") || "";

  // Filter out empty entries
  const validExperience = experience.filter(exp => exp.company?.trim() || exp.position?.trim());
  const validEducation = education.filter(edu => edu.school?.trim() || edu.degree?.trim());
  const validProjects = projects.filter(proj => proj.name?.trim());
  const validCertifications = certifications.filter(cert => cert.name?.trim());
  const validSkills = skills.filter(skill => skill.name?.trim());

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
    ${[
      personalInfo.phone ? `\\small ${escapeLatex(personalInfo.phone)}` : "",
      personalInfo.email ? `\\href{mailto:${personalInfo.email}}{${escapeLatex(personalInfo.email)}}` : "",
      personalInfo.linkedin ? `\\href{${ensureProtocol(personalInfo.linkedin)}}{LinkedIn}` : "",
      personalInfo.github ? `\\href{${ensureProtocol(personalInfo.github)}}{GitHub}` : "",
      linksLatex ? linksLatex : ""
    ].filter(Boolean).join(" $|$ ")}
\\end{center}

${personalInfo.objective?.trim() ? `
\\section{Professional Summary}
${escapeLatex(personalInfo.objective)}
` : ""}

${validExperience.length > 0 ? `
\\section{Experience}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${validExperience.map(exp => `
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(exp.position)}} & ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)} \\\\
        \\textit{${escapeLatex(exp.company)}} \\\\
      \\end{tabular*}\\vspace{-5pt}
      ${exp.description?.trim() ? `
      \\begin{itemize}
        ${exp.description.split('\\n').filter(line => line.trim()).map(line => `\\item ${escapeLatex(line)}`).join('\n        ')}
      \\end{itemize}
      ` : ""}
    `).join('')}
  \\end{itemize}
` : ""}

${validProjects.length > 0 ? `
\\section{Projects}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${validProjects.map(proj => `
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(proj.name)}} ${proj.technologies?.trim() ? `$|$ \\textit{\\small ${escapeLatex(proj.technologies)}}` : ""} & ${escapeLatex(proj.startDate)} -- ${escapeLatex(proj.endDate)} \\\\
        ${proj.url?.trim() ? `\\textit{\\href{${ensureProtocol(proj.url)}}{${escapeLatex(proj.url)}}} \\\\` : ""}
      \\end{tabular*}\\vspace{-5pt}
      ${proj.description?.trim() ? `
      \\begin{itemize}
        ${proj.description.split('\\n').filter(line => line.trim()).map(line => `\\item ${escapeLatex(line)}`).join('\n        ')}
      \\end{itemize}
      ` : ""}
    `).join('')}
  \\end{itemize}
` : ""}

${validEducation.length > 0 ? `
\\section{Education}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${validEducation.map(edu => `
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(edu.school)}} & ${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)} \\\\
        \\textit{${escapeLatex(edu.degree)}} \\\\
      \\end{tabular*}\\vspace{-5pt}
      ${edu.description?.trim() ? `
      \\begin{itemize}
        ${edu.description.split('\\n').filter(line => line.trim()).map(line => `\\item ${escapeLatex(line)}`).join('\n        ')}
      \\end{itemize}
      ` : ""}
    `).join('')}
  \\end{itemize}
` : ""}

${validCertifications.length > 0 ? `
\\section{Certifications \\& Awards}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    ${validCertifications.map(cert => `
    \\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(cert.name)}} & ${escapeLatex(cert.date)} \\\\
        \\textit{${escapeLatex(cert.issuer)}} \\\\
      \\end{tabular*}\\vspace{-5pt}
    `).join('')}
  \\end{itemize}
` : ""}

${validSkills.length > 0 ? `
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\item{
     \\textbf{Skills}{: ${validSkills.map(s => escapeLatex(s.name)).join(', ')}}
    }
 \\end{itemize}
` : ""}

\\end{document}
`;
};
