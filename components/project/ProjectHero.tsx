"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cs = project.caseStudy!;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-label]", { y: 20, opacity: 0, duration: 0.6, delay: 1.8 })
        .from("[data-hero-title]", { y: 40, opacity: 0, duration: 0.8 }, "-=0.3")
        .from("[data-hero-desc]", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from("[data-hero-tags] span", { y: 10, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.3")
        .from("[data-hero-ctas] a", { y: 10, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.2")
        .from("[data-hero-screenshot]", { y: 30, opacity: 0, duration: 0.7, stagger: 0.15 }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <p data-hero-label className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-6">
          CASE STUDY // {cs.number}
        </p>

        {/* Title */}
        <h1
          data-hero-title
          className="font-headline text-4xl md:text-6xl lg:text-7xl text-on-surface leading-[1.1] max-w-3xl"
        >
          {project.title}
        </h1>

        {/* Description */}
        <p data-hero-desc className="font-body text-on-surface-variant/70 text-base md:text-lg max-w-2xl mt-6 leading-relaxed">
          {cs.heroDescription}
        </p>

        {/* Tags */}
        <div data-hero-tags className="flex flex-wrap gap-2 mt-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-label text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-primary/30 text-primary/80"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div data-hero-ctas className="flex items-center gap-8 mt-8">
          {cs.liveUrl && (
            <Link
              href={cs.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mag-btn inline-flex items-center gap-2 font-label text-sm uppercase tracking-wider px-6 py-3 bg-primary text-background rounded-full hover:bg-primary-container transition-colors"
            >
              View Live
              <span className="material-symbols-outlined text-base">arrow_outward</span>
            </Link>
          )}
          {cs.githubUrl && (
            <Link
              href={cs.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mag-btn inline-flex items-center gap-2 font-label text-sm uppercase tracking-wider px-6 py-3 border border-outline-variant/40 text-on-surface-variant rounded-full hover:border-primary/50 hover:text-primary transition-colors"
            >
              GitHub
              <span className="material-symbols-outlined text-base">code</span>
            </Link>
          )}
        </div>

        {/* Screenshots */}
        {cs.screenshots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {cs.screenshots.map((src, i) => (
              <div
                key={i}
                data-hero-screenshot
                className="relative aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant/20 bg-surface-container"
              >
                <Image
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
