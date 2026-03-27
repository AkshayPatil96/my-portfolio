"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitType from "split-type";
import { coreStack } from "@/lib/data";
import SkillBars from "./SkillBars";

/**
 * AboutBio — text content column with:
 * - SplitType line-by-line title reveal
 * - Staggered paragraph fade-ups
 * - Core stack badge cloud with staggered entrance
 */
export default function AboutBio() {
  useEffect(() => {


    // Title word reveal
    ScrollTrigger.create({
      trigger: "#about-title",
      start: "top 82%",
      once: true,
      onEnter() {
        const split = new SplitType("#about-title", { types: "lines" });
        gsap.set("#about-title", { opacity: 1 });
        gsap.from(split.lines, {
          y: 70,
          opacity: 0,
          clipPath: "inset(0 0 100% 0)",
          stagger: 0.14,
          duration: 1,
          ease: "power3.out",
        });
      },
    });

    // Staggered badge reveal
    ScrollTrigger.create({
      trigger: "#core-stack",
      start: "top 85%",
      once: true,
      onEnter() {
        gsap.from("#core-stack .stack-badge", {
          y: 18,
          opacity: 0,
          scale: 0.85,
          stagger: 0.07,
          duration: 0.6,
          ease: "back.out(1.6)",
        });
      },
    });

    // Generic fade-ups in the bio section
    document
      .querySelectorAll<HTMLElement>("#about-bio-col .gsap-fade")
      .forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 44,
          opacity: 0,
          duration: 0.9,
          delay: parseFloat(el.dataset.delay ?? "0"),
          ease: "power3.out",
        });
      });
  }, []);

  return (
    <div id="about-bio-col" className="w-full md:w-[60%] flex flex-col flex-1">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-8 gsap-fade">
        <span className="font-label text-primary text-sm tracking-[0.3em] font-bold">
          03 / ABOUT
        </span>
        <div className="h-[0.5px] w-10 bg-outline-variant/30" />
      </div>

      {/* Headline */}
      <h2
        id="about-title"
        className="font-headline text-5xl md:text-6xl lg:text-7xl text-on-surface leading-[1.1] mb-10 tracking-tight"
        style={{ opacity: 0 }}
      >
        Code, Café &amp; <em className="text-primary">Beyond.</em>
      </h2>

      {/* Bio paragraphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        <p className="gsap-fade text-on-surface-variant text-base md:text-lg leading-relaxed font-light">
          Full-stack developer with 3.5+ years building production-grade
          applications. Currently at Value Creatives Tech Solutions LLP.
          Non-traditional path — left engineering, ran a café, then entered tech
          via MERN bootcamp.
        </p>
        <p
          className="gsap-fade text-on-surface-variant text-base md:text-lg leading-relaxed font-light"
          data-delay="0.12"
        >
          I approach every project as a curator — selecting the right
          technologies to build scalable, resilient architectures. Specialising
          in Node.js backends, React frontends, and everything AWS in between.
        </p>
      </div>

      <div className="w-full h-[0.5px] bg-outline-variant/20 mb-12 gsap-fade" />

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        {/* Core Stack badges */}
        <div className="flex flex-col gap-5 gsap-fade">
          <h3 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            Core Stack
          </h3>
          <div id="core-stack" className="flex flex-wrap gap-2">
            {coreStack.map((tech) => (
              <span
                key={tech}
                className="stack-badge px-4 py-2 rounded-full border border-outline-variant/20 font-label text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-container-high/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Proficiency skill bars */}
        <SkillBars />
      </div>
    </div>
  );
}
