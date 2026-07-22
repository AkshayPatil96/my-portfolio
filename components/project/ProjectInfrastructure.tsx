"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/data";

interface ProjectInfrastructureProps {
  caseStudy: CaseStudy;
}

export default function ProjectInfrastructure({ caseStudy }: ProjectInfrastructureProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-infra-item]", {
        scrollTrigger: {
          trigger: "[data-infra-items]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!caseStudy.infrastructure) return null;

  return (
    <section ref={sectionRef} className="py-12 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]">
      <div className="max-w-6xl mx-auto">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-4">
          {caseStudy.infrastructure.eyebrow}
        </p>
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight mb-16">
          {caseStudy.infrastructure.title}
        </h2>

        {caseStudy.infrastructure.intro && (
          <p className="font-body text-on-surface-variant/40 text-sm mb-10 max-w-2xl">
            {caseStudy.infrastructure.intro}
          </p>
        )}

        {caseStudy.infrastructure.groups ? (
          <div className="space-y-14">
            {caseStudy.infrastructure.groups.map((group, gi) => (
              <div key={gi}>
                <h3 className="font-label text-xs uppercase tracking-[0.25em] text-primary/40 mb-6">
                  {group.label}
                </h3>
                <div data-infra-items className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {group.items.map((item, i) => (
                    <div key={i} data-infra-item>
                      <h3 className="font-label text-base font-semibold text-on-surface mb-2">
                        {item.title}
                      </h3>
                      <p className="font-body text-on-surface-variant/50 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div data-infra-items className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {(caseStudy.infrastructure.items ?? []).map((item, i) => (
              <div key={i} data-infra-item>
                <h3 className="font-label text-base font-semibold text-on-surface mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-on-surface-variant/50 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
