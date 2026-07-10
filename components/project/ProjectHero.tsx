"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";
import ScreenshotCarousel from "./ScreenshotCarousel";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cs = project.caseStudy!;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-label]", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        delay: 1.8,
      })
        // Horizontal rule wipes in from the left — editorial reveal
        .from(
          "[data-hero-line]",
          { scaleX: 0, transformOrigin: "left", duration: 0.7, ease: "power2.inOut" },
          "-=0.2",
        )
        .from(
          "[data-hero-title]",
          { y: 60, opacity: 0, duration: 0.9 },
          "-=0.45",
        )
        .from("[data-hero-desc]", { y: 20, opacity: 0, duration: 0.6 }, "-=0.55")
        .from(
          "[data-hero-tags] span",
          { y: 10, opacity: 0, duration: 0.4, stagger: 0.05 },
          "-=0.3",
        )
        .from(
          "[data-hero-ctas] a",
          { y: 10, opacity: 0, duration: 0.4, stagger: 0.1 },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 bg-[#0B0B0B] overflow-hidden"
      >
        {/* Background — first screenshot, radial vignette so image breathes in center */}
        {cs.screenshots.length > 0 && (
          <div
            className="absolute inset-0 pointer-events-none select-none"
            aria-hidden="true"
          >
            <Image
              src={cs.screenshots[0]}
              alt=""
              fill
              className="object-cover grayscale opacity-[0.12]"
              priority
            />
            {/* Radial vignette: darkens the edges, lets the image breathe in the middle */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 55% 45%, transparent 15%, #0B0B0B 72%)",
              }}
            />
            {/* Bottom fade into carousel section */}
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
          </div>
        )}

        {/* Watermark case-study number — depth layer, barely visible */}
        <span
          className="absolute right-0 bottom-0 font-headline leading-none tracking-tighter text-on-surface/[0.022] select-none pointer-events-none"
          style={{ fontSize: "clamp(10rem, 28vw, 22rem)" }}
          aria-hidden="true"
        >
          {cs.number}
        </span>

        {/* Content anchored to the bottom of the viewport */}
        <div className="relative max-w-6xl mx-auto w-full pb-24">

          {/* Label row */}
          <div
            data-hero-label
            className="flex items-center justify-between mb-8"
          >
            <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/60">
              CASE STUDY // {cs.number}
            </p>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-outline-variant/50 hidden md:block">
              {project.slug.replace(/-/g, "\u00A0")}
            </p>
          </div>

          {/* Divider — animates in as a scaleX wipe from the left */}
          <div
            data-hero-line
            className="w-full h-px bg-outline-variant/30 mb-10"
          />

          {/* Split grid: giant title left — meta right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-end">

            {/* Left: editorial title */}
            <h1
              data-hero-title
              className="font-headline text-on-surface leading-[0.93] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)" }}
            >
              {project.title}
            </h1>

            {/* Right: description + tags + CTAs */}
            <div className="flex flex-col gap-6">
              <p
                data-hero-desc
                className="font-body text-on-surface-variant/65 text-sm md:text-base leading-relaxed"
              >
                {cs.heroDescription}
              </p>

              <div data-hero-tags className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-label text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-primary/25 text-primary/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div data-hero-ctas className="flex items-center gap-3">
                {cs.liveUrl && (
                  <Link
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mag-btn inline-flex items-center gap-2 font-label text-sm uppercase tracking-wider px-6 py-3 bg-primary text-background rounded-full hover:bg-primary-container transition-colors"
                  >
                    Live
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
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
          aria-hidden="true"
        >
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/30">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-on-surface-variant/30 to-transparent" />
        </div>
      </section>

      {/* Screenshots carousel — sits directly below the 100 vh hero */}
      {cs.screenshots.length > 0 && (
        <section className="bg-[#0B0B0B] px-6 md:px-12 lg:px-24 pt-16 pb-20">
          <div className="max-w-6xl mx-auto">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/40 mb-6">
              SCREENSHOTS
            </p>
            <ScreenshotCarousel
              screenshots={cs.screenshots}
              title={project.title}
              autoplay
              thumbnails
            />
          </div>
        </section>
      )}
    </>
  );
}
