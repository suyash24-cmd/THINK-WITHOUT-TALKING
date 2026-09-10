import { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  number?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({
  id,
  number,
  title,
  subtitle,
  children,
  className = "",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`min-h-screen py-20 px-6 ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          {number && (
            <p className="text-xs font-mono text-accent mb-3 tracking-widest uppercase">
              {number}
            </p>
          )}
          <h2
            id={`${id}-title`}
            className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-text-secondary mt-3 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
