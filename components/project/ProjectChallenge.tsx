"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import type { CaseStudy } from "@/lib/data";

interface ProjectChallengeProps {
  caseStudy: CaseStudy;
}

export default function ProjectChallenge({ caseStudy }: ProjectChallengeProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-challenge-left] > *", {
        scrollTrigger: {
          trigger: "[data-challenge-left]",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from("[data-challenge-right] > *", {
        scrollTrigger: {
          trigger: "[data-challenge-right]",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      });

      if (caseStudy.architectureImage) {
        gsap.from("[data-arch-image]", {
          scrollTrigger: {
            trigger: "[data-arch-image]",
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [caseStudy.architectureImage]);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]">
      <div className="max-w-6xl mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — Challenge */}
          <div data-challenge-left>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-4">
              {caseStudy.challenge.eyebrow}
            </p>
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight">
              {caseStudy.challenge.title}
            </h2>
            <p className="font-body text-on-surface-variant/60 text-sm md:text-base mt-6 leading-relaxed">
              {caseStudy.challenge.description}
            </p>
          </div>

          {/* Right — Engineering Response */}
          <div data-challenge-right>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-4">
              {caseStudy.engineeringResponse.eyebrow}
            </p>
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight mb-8">
              {caseStudy.engineeringResponse.title}
            </h2>

            <div className="space-y-6">
              {caseStudy.engineeringResponse.solutions.map((sol, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">
                      {sol.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label text-sm font-semibold text-on-surface mb-1">
                      {sol.title}
                    </h3>
                    <p className="font-body text-on-surface-variant/50 text-sm leading-relaxed">
                      {sol.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture Image */}
        {caseStudy.architectureImage && (
          <div data-arch-image className="mt-20">
            <div className="relative aspect-[8/3] rounded-lg overflow-hidden border border-outline-variant/20 bg-surface-container">
              <Image
                src={caseStudy.architectureImage}
                alt={caseStudy.architectureCaption || "Architecture diagram"}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            {caseStudy.architectureCaption && (
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/30 text-center mt-4">
                {caseStudy.architectureCaption}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
