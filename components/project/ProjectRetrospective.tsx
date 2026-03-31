"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/data";

interface ProjectRetrospectiveProps {
  caseStudy: CaseStudy;
}

export default function ProjectRetrospective({ caseStudy }: ProjectRetrospectiveProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {


    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        defaults: { ease: "power3.out" },
      });

      tl.from("[data-retro-label]", { y: 20, opacity: 0, duration: 0.5 })
        .from("[data-retro-quote]", { y: 30, opacity: 0, duration: 0.7 }, "-=0.2")
        .from("[data-retro-close]", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-6 md:px-12 lg:px-24 bg-[#0e0e0e]">
      <div className="max-w-3xl mx-auto text-center">
        <p
          data-retro-label
          className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-8"
        >
          {caseStudy.retrospective.eyebrow}
        </p>

        <blockquote
          data-retro-quote
          className="font-headline text-2xl md:text-4xl lg:text-5xl text-on-surface italic leading-tight"
        >
          &ldquo;{caseStudy.retrospective.quote}&rdquo;
        </blockquote>

        <p
          data-retro-close
          className="font-body text-on-surface-variant/50 text-sm md:text-base mt-10 leading-relaxed max-w-xl mx-auto"
        >
          {caseStudy.retrospective.closing}
        </p>
      </div>
    </section>
  );
}
