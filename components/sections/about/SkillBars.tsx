"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { skills } from "@/lib/data";

/**
 * SkillBars — animated proficiency bars.
 * Bars fill from 0 → target width when scrolled into view.
 * Each bar has a subtle stagger and ease-out.
 */
export default function SkillBars() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: "#skill-bars",
      start: "top 78%",
      once: true,
      onEnter() {
        document.querySelectorAll<HTMLElement>(".skill-fill").forEach((bar, i) => {
          gsap.to(bar, {
            width: bar.dataset.w + "%",
            duration: 1.4,
            delay: i * 0.1,
            ease: "power3.out",
          });
        });
      },
    });
  }, []);

  return (
    <div id="skill-bars" className="flex flex-col gap-5">
      <h3 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
        Proficiency
      </h3>
      <div className="space-y-5">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex justify-between font-label text-[10px] uppercase tracking-widest text-on-surface">
              <span>{skill.name}</span>
              <span>{skill.value}%</span>
            </div>
            <div className="h-[2px] w-full bg-surface-container-highest">
              <div
                className="skill-fill h-full bg-primary"
                data-w={skill.value}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
