import React from "react";
import { useResume } from "@/context/ResumeContext";

const ensureProtocol = (url: string) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed === "#") return "#";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export default function HtmlResumeMirror() {
  const { resumeData } = useResume();
  const { personalInfo, education, experience, projects, certifications, skills, customLinks } = resumeData;

  const validExperience = experience.filter(exp => exp.company?.trim() || exp.position?.trim());
  const validEducation = education.filter(edu => edu.school?.trim() || edu.degree?.trim());
  const validProjects = projects.filter(proj => proj.name?.trim());
  const validCertifications = certifications.filter(cert => cert.name?.trim());
  const validSkills = skills.filter(skill => skill.name?.trim());
  const validLinks = customLinks?.filter(link => link.name && link.url) || [];

  const contactParts: React.ReactElement[] = [];
  if (personalInfo.phone) contactParts.push(<span key="phone">{personalInfo.phone}</span>);
  if (personalInfo.email) contactParts.push(<a key="email" href={`mailto:${personalInfo.email}`} className="text-blue-800 hover:underline">{personalInfo.email}</a>);
  if (personalInfo.linkedin) contactParts.push(<a key="linkedin" href={ensureProtocol(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">LinkedIn</a>);
  if (personalInfo.github) contactParts.push(<a key="github" href={ensureProtocol(personalInfo.github)} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">GitHub</a>);
  validLinks.forEach(link => {
    contactParts.push(<a key={link.id} href={ensureProtocol(link.url)} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">{link.name}</a>);
  });

  return (
    <div className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black shadow-2xl" style={{ fontFamily: "'Computer Modern Serif', 'Latin Modern Roman', 'CMU Serif', 'STIX Two Text', 'Times New Roman', serif", fontSize: "10.5pt", lineHeight: "1.3", padding: "0.5in 0.75in" }}>
      {/* Header */}
      <div className="text-center mb-1">
        <h1 style={{ fontSize: "22pt", fontWeight: 700, fontVariant: "small-caps", letterSpacing: "0.5px", marginBottom: "2pt" }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {contactParts.length > 0 && (
          <div style={{ fontSize: "9.5pt" }} className="flex flex-wrap justify-center items-center gap-0">
            {contactParts.map((part, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span className="mx-1.5 text-gray-400">|</span>}
                {part}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {personalInfo.objective?.trim() && (
        <section className="mt-1">
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ fontSize: "10.5pt", textAlign: "justify" }}>{personalInfo.objective}</p>
        </section>
      )}

      {/* Experience */}
      {validExperience.length > 0 && (
        <section className="mt-1">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-1.5">
            {validExperience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.position}</span>
                  <span style={{ fontSize: "10pt" }}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic" style={{ fontSize: "10pt" }}>{exp.company}</div>
                {exp.description?.trim() && (
                  <ul className="list-disc ml-5 mt-0.5" style={{ fontSize: "10pt" }}>
                    {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="pl-0.5">{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {validProjects.length > 0 && (
        <section className="mt-1">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-1.5">
            {validProjects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span>
                    <span className="font-bold" style={{ fontSize: "10.5pt" }}>{proj.name}</span>
                    {proj.technologies?.trim() && (
                      <span className="text-gray-500 mx-1">|</span>
                    )}
                    {proj.technologies?.trim() && (
                      <span className="italic" style={{ fontSize: "9.5pt" }}>{proj.technologies}</span>
                    )}
                  </span>
                  <span style={{ fontSize: "10pt" }}>{proj.startDate} – {proj.endDate}</span>
                </div>
                {proj.url?.trim() && (
                  <div className="italic" style={{ fontSize: "9.5pt" }}>
                    <a href={ensureProtocol(proj.url)} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">{proj.url}</a>
                  </div>
                )}
                {proj.description?.trim() && (
                  <ul className="list-disc ml-5 mt-0.5" style={{ fontSize: "10pt" }}>
                    {proj.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="pl-0.5">{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {validEducation.length > 0 && (
        <section className="mt-1">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-1.5">
            {validEducation.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.school}</span>
                  <span style={{ fontSize: "10pt" }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="italic" style={{ fontSize: "10pt" }}>{edu.degree}</div>
                {edu.description?.trim() && (
                  <ul className="list-disc ml-5 mt-0.5" style={{ fontSize: "10pt" }}>
                    {edu.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="pl-0.5">{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {validCertifications.length > 0 && (
        <section className="mt-1">
          <SectionTitle>Certifications & Awards</SectionTitle>
          <div className="space-y-1">
            {validCertifications.map(cert => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold" style={{ fontSize: "10.5pt" }}>{cert.name}</span>
                  <span style={{ fontSize: "10pt" }}>{cert.date}</span>
                </div>
                <div className="italic" style={{ fontSize: "10pt" }}>{cert.issuer}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {validSkills.length > 0 && (
        <section className="mt-1">
          <SectionTitle>Technical Skills</SectionTitle>
          <div style={{ fontSize: "10.5pt" }}>
            <span className="font-bold">Skills</span>: {validSkills.map(s => s.name).join(', ')}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: "12pt", fontVariant: "small-caps", fontWeight: 400, borderBottom: "1px solid black", paddingBottom: "2px", marginBottom: "4px", letterSpacing: "0.5px" }}>
      {children}
    </h2>
  );
}
