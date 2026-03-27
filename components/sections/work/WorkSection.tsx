"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/lib/data";
import ProjectCardClip from "./ProjectCardClip";
import ProjectCardTilt from "./ProjectCardTilt";
import ProjectCardGlitch from "./ProjectCardGlitch";
import ProjectCardNeon from "./ProjectCardNeon";
import ProjectCardTiltNeon from "./ProjectCardTiltNeon";
import type { Project } from "@/lib/data";
import type { ComponentType } from "react";

const CARD_MAP: Record<string, ComponentType<{ project: Project }>> = {
  clip: ProjectCardClip,
  tilt: ProjectCardTilt,
  glitch: ProjectCardGlitch,
  neon: ProjectCardNeon,
  tiltneon: ProjectCardTiltNeon,
};

export default function WorkSection() {
  const counterRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const n = projects.length;
    const cardEls = gsap.utils.toArray<HTMLElement>(".work-card-item");

    // Initial state: first card visible, rest hidden below
    gsap.set(cardEls, { autoAlpha: 0, y: 50 });
    gsap.set(cardEls[0], { autoAlpha: 1, y: 0 });

    // Build transition timeline: exit → enter for each pair
    const tl = gsap.timeline({ paused: true });
    for (let i = 0; i < n - 1; i++) {
      tl.to(cardEls[i], {
        autoAlpha: 0,
        y: -50,
        duration: 0.4,
        ease: "power2.in",
      }).fromTo(
        cardEls[i + 1],
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }

    const updateIndicators = (idx: number) => {
      if (counterRef.current) {
        counterRef.current.textContent = String(idx + 1).padStart(2, "0");
      }
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.opacity = i === idx ? "1" : "0.25";
        dot.style.transform = i === idx ? "scaleY(2.5)" : "scaleY(1)";
      });
    };

    const st = ScrollTrigger.create({
      trigger: "#work",
      start: "top top",
      end: () => `+=${window.innerHeight * n}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      animation: tl,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const idx = Math.min(Math.floor(self.progress * n), n - 1);
        updateIndicators(idx);
      },
    });

    // Fade-up for section header
    document.querySelectorAll<HTMLElement>("#work .gsap-fade").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: "#work",
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

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section id="work" className="h-screen flex flex-col overflow-hidden">
      {/* Section header */}
      <div className="px-8 md:px-12 pt-16 pb-6 flex justify-between items-end max-w-[1920px] mx-auto w-full flex-shrink-0">
        <div className="gsap-fade">
          <span className="font-label text-xs uppercase tracking-[0.3em] text-primary block mb-2">
            02 / selected work
          </span>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter font-headline">
            Digital Exhibits.
          </h2>
        </div>
        <div className="hidden md:block text-right gsap-fade" data-delay="0.15">
          <div className="flex items-baseline gap-1">
            <span ref={counterRef} className="font-label text-4xl font-light tracking-tighter opacity-20">
              01
            </span>
            <span className="font-label text-4xl font-light tracking-tighter opacity-10">/</span>
            <span className="font-label text-4xl font-light tracking-tighter opacity-20">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mt-1">
            Project / Total
          </p>
        </div>
      </div>

      {/* Cards stage */}
      <div className="flex-1 relative overflow-hidden px-8 md:px-12 pb-10">
        {/* Progress dots */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-[6px] z-10">
          {projects.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotsRef.current[i] = el; }}
              className="w-[3px] h-[14px] rounded-full bg-primary transition-all duration-300 origin-center"
              style={{ opacity: i === 0 ? 1 : 0.25, transform: i === 0 ? "scaleY(2.5)" : "scaleY(1)" }}
            />
          ))}
        </div>

        {/* Stacked cards */}
        <div className="relative h-full max-w-5xl mx-auto">
          {projects.map((project, i) => {
            const CardComponent = CARD_MAP[project.variant];
            return (
              <div
                key={project.id}
                className="work-card-item absolute inset-0 flex items-center"
              >
                <div className="w-full">
                  <CardComponent project={project} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
