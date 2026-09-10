"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";

const teamRoles = [
  {
    role: "Senior Product Engineer / Frontend Architect",
    responsibility: "Interactive web application, experimentation interface",
  },
  {
    role: "ML Engineer",
    responsibility: "Toy model training, sweeps, result export",
  },
  {
    role: "Research Scientist",
    responsibility: "Literature review, BDH/BDH-CQ integration, citation discipline",
  },
  {
    role: "Data Scientist",
    responsibility: "Data pipelines, statistical analysis, chart data",
  },
  {
    role: "Educational Designer",
    responsibility: "Learning journey, experiment narrative, failure cases",
  },
];

const licenses = [
  { name: "Code", license: "MIT License" },
  { name: "Experiment data", license: "CC-BY 4.0" },
  { name: "Tree of Thoughts (cited work)", license: "Referenced under fair academic citation" },
  { name: "Universal Transformers (cited work)", license: "Referenced under fair academic citation" },
];

export default function About() {
  return (
    <SectionWrapper
      id="about"
      number="10"
      title="About & AI Disclosure"
      subtitle="Who built this, how it&apos;s licensed, and how AI was used."
    >
      <div className="space-y-10">
        {/* AI Disclosure */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            AI Assistance Disclosure
          </p>
          <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
            <p>
              This product was developed by a 5-agent autonomous AI team as part of the DataForge 2026
              competition. The final product — including code, design, and this documentation — was
              produced with substantial AI assistance.
            </p>
            <p className="text-text-primary font-medium">Division of responsibility:</p>
            <ul className="space-y-2">
              {teamRoles.map((member) => (
                <li key={member.role} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                  <span className="font-mono text-xs text-amber shrink-0 w-56 sm:w-72">
                    {member.role}
                  </span>
                  <span className="text-xs text-text-muted">{member.responsibility}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-text-muted border-t border-border-subtle pt-4">
              All scientific claims have been either sourced from published research or explicitly
              labeled as experiments performed by this team. No results have been fabricated.
              The toy model experiments are reproducible from the provided source code.
            </p>
          </div>
        </div>

        {/* Provenance */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            Source & License Record
          </p>
          <div className="space-y-2">
            {licenses.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4 bg-elevated rounded-lg px-4 py-3 border border-border"
              >
                <span className="text-sm text-text-primary">{item.name}</span>
                <span className="text-xs font-mono text-text-muted">{item.license}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-4">
            Full license texts and attribution records are provided in the repository.
          </p>
        </div>

        {/* Scientific Integrity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            Scientific Integrity Statement
          </p>
          <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
            <p>
              This project is an educational tool, not a research paper claiming new scientific findings.
              Its purpose is to help learners understand a complex research idea:
            </p>
            <p className="text-text-primary font-medium italic">
              &quot;Models can improve their answers by refining an internal state without generating
              natural-language tokens — but more latent computation does not guarantee better reasoning.&quot;
            </p>
            <p>
              Every claim in this product falls into one of four categories, all clearly labeled
              throughout:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent font-mono text-xs mt-0.5 shrink-0">A.</span>
                <span>Published research results (cited with sources)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber font-mono text-xs mt-0.5 shrink-0">B.</span>
                <span>Our own toy-model experiments (reproducible)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-mono text-xs mt-0.5 shrink-0">C.</span>
                <span>Illustrative explanations (clearly labeled as simplified)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 font-mono text-xs mt-0.5 shrink-0">D.</span>
                <span>Hypotheses/inferences (explicitly stated as such)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Version */}
        <div className="text-center">
          <p className="text-xs font-mono text-text-muted">
            THINK WITHOUT TALKING v1.0.0 — DataForge 2026 Pathway Track
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}