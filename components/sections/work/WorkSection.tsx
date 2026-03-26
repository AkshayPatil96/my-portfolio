"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = document.getElementById("work-track");
    if (!track) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLDivElement>(".proj-card-wrap")
    );
    const GAP = 32;

    // Start all cards clipped
    gsap.set(cards, { clipPath: "inset(0 100% 0 0)" });

    const totalScroll = () => {
      let w = 0;
      cards.forEach((c) => {
        w += c.offsetWidth + GAP;
      });
      return w - window.innerWidth + 96;
    };

    const st = ScrollTrigger.create({
      trigger: "#work",
      start: "top top",
      end: () => "+=" + (totalScroll() + window.innerHeight * 0.6),
      pin: true,
      anticipatePin: 1,
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate(self) {
        gsap.set(track, { x: -totalScroll() * self.progress });

        const step = 1 / (cards.length + 1);
        cards.forEach((card, i) => {
          const start = i * step * 0.8;
          const end = start + step * 1.4;
          const t = Math.max(
            0,
            Math.min(1, (self.progress - start) / (end - start))
          );
          const pct = Math.round((1 - t) * 100);
          card.style.clipPath = `inset(0 ${pct}% 0 0)`;
        });
      },
    });

    // Generic fade-up for section header
    document.querySelectorAll<HTMLElement>("#work .gsap-fade").forEach((el) => {
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

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section id="work">
      {/* Section header */}
      <div className="px-8 md:px-12 pt-24 pb-12 flex justify-between items-end max-w-[1920px] mx-auto">
        <div className="gsap-fade">
          <span className="font-label text-xs uppercase tracking-[0.3em] text-primary block mb-2">
            02 / selected work
          </span>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter font-headline">
            Digital Exhibits.
          </h2>
        </div>
        <div className="hidden md:block text-right gsap-fade" data-delay="0.15">
          <span className="font-label text-4xl font-light tracking-tighter opacity-20">
            04
          </span>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mt-1">
            Projects / Total
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div id="work-pin-wrap" style={{ overflow: "hidden" }}>
        <div id="work-sticky" className="px-8 md:px-12 pb-20 overflow-hidden">
          <div id="work-track">
            {projects.map((project, i) => {
              const CardComponent = CARD_MAP[project.variant];
              return (
                <div
                  key={project.id}
                  className="proj-card-wrap"
                  ref={(el) => { cardRefs.current[i] = el; }}
                >
                  <CardComponent project={project} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
