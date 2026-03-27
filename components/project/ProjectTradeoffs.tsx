"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CaseStudy } from "@/lib/data";

interface ProjectTradeoffsProps {
  caseStudy: CaseStudy;
}

export default function ProjectTradeoffs({ caseStudy }: ProjectTradeoffsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-tradeoff-item]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!caseStudy.tradeoffs) return null;

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-24 bg-[#0e0e0e]">
      <div className="max-w-6xl mx-auto">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-12">
          {caseStudy.tradeoffs.eyebrow}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudy.tradeoffs.items.map((item, i) => (
            <div
              key={i}
              data-tradeoff-item
              className="glass-card ghost-border rounded-lg p-6 flex gap-4 items-start"
            >
              <span className="material-symbols-outlined text-primary/60 text-lg mt-0.5 flex-shrink-0">
                swap_horiz
              </span>
              <p className="font-body text-on-surface-variant/60 text-sm leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
