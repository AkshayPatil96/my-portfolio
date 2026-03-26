"use client";

import Link from "next/link";
import type { Project } from "@/lib/data";

interface ProjectFooterProps {
  currentProject: Project;
  allProjects: Project[];
}

export default function ProjectFooter({ currentProject, allProjects }: ProjectFooterProps) {
  const currentIndex = allProjects.findIndex((p) => p.slug === currentProject.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <footer className="py-16 px-6 md:px-12 lg:px-24 bg-[#0B0B0B] border-t border-outline-variant/10">
      <div className="max-w-6xl mx-auto">
        {/* Next project link */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/40 mb-2">
              Next Case Study
            </p>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="font-headline text-2xl md:text-3xl text-on-surface hover:text-primary transition-colors"
            >
              {nextProject.title}
              <span className="material-symbols-outlined text-primary ml-2 align-middle">
                arrow_forward
              </span>
            </Link>
          </div>
          <Link
            href="/#work"
            className="font-label text-sm uppercase tracking-wider text-on-surface-variant/50 hover:text-primary transition-colors"
          >
            View All Projects
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-outline-variant/10">
          <p className="font-label text-xs text-on-surface-variant/30">
            &copy; {new Date().getFullYear()} AKSHAY. BUILT WITH PRECISION.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub", "Email"].map((link) => (
              <span
                key={link}
                className="font-label text-xs uppercase tracking-wider text-on-surface-variant/30 hover:text-primary/60 transition-colors cursor-pointer"
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
