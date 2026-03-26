"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { experiences } from "@/lib/data";
import type { Experience } from "@/lib/data";

export default function ExperienceSection() {
  const [activePopup, setActivePopup] = useState<Experience | null>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Timeline SVG line draw via scrub
      const tlLine = document.getElementById("tl-line");
      const tlContainer = document.getElementById("timeline-container");
      if (tlLine && tlContainer) {
        ScrollTrigger.create({
          trigger: tlContainer,
          start: "top 65%",
          end: "bottom 35%",
          scrub: 2,
          onUpdate(self) {
            const h = tlContainer.offsetHeight;
            const svg = document.getElementById("timeline-svg");
            if (svg) svg.style.height = h + "px";
            tlLine.setAttribute("y2", String(h));
            const len = h + 20;
            tlLine.setAttribute("stroke-dasharray", String(len));
            tlLine.setAttribute(
              "stroke-dashoffset",
              String(len * (1 - self.progress)),
            );
          },
        });
      }

      // Fade-ups
      document
        .querySelectorAll<HTMLElement>("#experience .gsap-fade")
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      className="py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(200,169,126,0.04) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-20 gsap-fade">
          <span className="font-label text-primary tracking-[0.4em] uppercase text-sm block mb-4">
            04 / experience
          </span>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-2xl leading-tight">
            Professional <em className="italic font-normal">Chapters</em>
          </h2>
        </div>

        {/* Timeline */}
        <div
          className="relative"
          id="timeline-container"
        >
          <svg
            id="timeline-svg"
            className="absolute pointer-events-none hidden md:block"
            style={{
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              width: "2px",
              zIndex: 0,
              overflow: "visible",
            }}
          >
            <line
              id="tl-line"
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="rgba(229,196,151,0.25)"
              strokeWidth="1.5"
              strokeDasharray="2000"
              strokeDashoffset="2000"
            />
          </svg>

          <div className="space-y-20 md:space-y-28">
            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                className="relative flex flex-col md:flex-row items-start md:items-center gsap-fade"
                data-delay={String(i * 0.1)}
              >
                {/* Year label (desktop left) */}
                <div className="hidden md:block w-1/2 pr-20 text-right">
                  <span className="font-label text-3xl lg:text-4xl font-light text-on-surface-variant/25 tracking-tighter">
                    {exp.period}
                  </span>
                </div>

                {/* Timeline dot */}
                <div
                  className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-background md:-translate-x-1/2 z-10 top-5 md:top-auto ${
                    exp.isCurrent ? "" : "bg-outline-variant"
                  }`}
                  style={
                    exp.isCurrent
                      ? {
                          background: "#e5c497",
                          boxShadow: "0 0 16px rgba(229,196,151,0.45)",
                        }
                      : undefined
                  }
                />

                {/* Card */}
                <div className="w-full md:w-1/2 md:pl-20 pl-8">
                  <div
                    className={`relative p-8 md:p-10 rounded-xl ghost-border transition-all duration-700 group ${
                      exp.isCurrent
                        ? "bg-surface-container-high hover:shadow-2xl"
                        : "bg-surface-container-low hover:bg-surface-container"
                    }`}
                  >
                    {/* Tooltip popup — slides in from the left on hover */}
                    {exp.details && exp.details.length > 0 && (
                      <div className="absolute right-full top-0 mr-4 w-96 z-50 pointer-events-none opacity-0 -translate-x-2 scale-[0.97] transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto">
                        <div
                          className="relative rounded-xl p-5 ghost-border"
                          style={{
                            background: "rgba(18,16,14,0.92)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                          }}
                        >
                          <p className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/60 mb-3">
                            Key Contributions
                          </p>
                          <ul className="space-y-2.5">
                            {exp.details.map((detail, di) => (
                              <li
                                key={di}
                                className="flex items-start gap-2.5"
                              >
                                <span className="text-primary/60 flex-shrink-0 font-bold leading-5">
                                  &rsaquo;
                                </span>
                                <span className="text-sm text-on-surface-variant leading-relaxed">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {/* Caret pointing right toward the card */}
                          <div
                            className="absolute right-0 top-6 translate-x-1/2 w-3 h-3 rotate-45"
                            style={{
                              background: "rgba(18,16,14,0.92)",
                              border: "0.5px solid rgba(78,69,59,0.35)",
                              borderBottom: "none",
                              borderLeft: "none",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <span
                      className="font-label text-[10px] uppercase tracking-[0.2em] block mb-4"
                      style={{
                        color: exp.isCurrent
                          ? "#e5c497"
                          : "rgba(209,197,183,0.6)",
                      }}
                    >
                      {exp.label}
                    </span>
                    <h3
                      className={`font-headline text-2xl md:text-3xl font-bold mb-1 transition-colors ${exp.isCurrent ? "group-hover:text-primary" : ""}`}
                    >
                      {exp.title}
                    </h3>
                    <p className="text-on-surface-variant text-base md:text-lg mb-2">
                      {exp.company}
                    </p>
                    {/* Mobile period */}
                    <p className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-6 md:hidden">
                      {exp.period}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-label text-[10px] uppercase tracking-wider px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full ghost-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* More Details CTA — always visible, opens popup on click */}
                    {exp.details && exp.details.length > 0 && (
                      <button
                        onClick={() => setActivePopup(exp)}
                        className="mt-5 flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.25em] text-primary/60 hover:text-primary transition-colors duration-200 group/btn"
                      >
                        <span>More Details</span>
                        <span className="w-5 h-px bg-primary/40 group-hover/btn:w-8 transition-all duration-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center gsap-fade">
          <p className="text-on-surface-variant text-lg italic mb-8">
            Looking for the full architectural blueprint?
          </p>
          <div className="flex justify-center gap-4 md:gap-6">
            <button className="mag-btn bg-primary text-on-primary font-label uppercase tracking-widest px-8 md:px-10 py-4 rounded-full text-xs font-bold">
              Download Resume
            </button>
            <button className="mag-btn ghost-border text-on-surface font-label uppercase tracking-widest px-8 md:px-10 py-4 rounded-full text-xs font-bold hover:bg-surface-container transition-all">
              View LinkedIn
            </button>
          </div>
        </div>
      </div>

      {/* Details popup modal */}
      {activePopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={() => setActivePopup(null)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Panel */}
          <div
            className="relative w-full max-w-lg rounded-2xl ghost-border p-7 md:p-9 shadow-2xl"
            style={{
              background: "rgba(18,16,14,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setActivePopup(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full ghost-border flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors duration-200"
              aria-label="Close"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Header */}
            <p
              className="font-label text-[10px] uppercase tracking-[0.25em] mb-1"
              style={{
                color: activePopup.isCurrent
                  ? "#e5c497"
                  : "rgba(209,197,183,0.6)",
              }}
            >
              {activePopup.label}
            </p>
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-0.5">
              {activePopup.title}
            </h3>
            <p className="text-on-surface-variant text-sm mb-1">
              {activePopup.company}
            </p>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40 mb-6">
              {activePopup.period}
            </p>

            {/* Divider */}
            <div className="h-px bg-primary/10 mb-6" />

            {/* Details */}
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/60 mb-4">
              Key Contributions
            </p>
            <ul className="space-y-3">
              {activePopup.details!.map((detail, di) => (
                <li
                  key={di}
                  className="flex items-start gap-3"
                >
                  <span className="text-primary/60 flex-shrink-0 font-bold leading-5 mt-0.5">
                    &rsaquo;
                  </span>
                  <span className="text-sm text-on-surface-variant leading-relaxed">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-7 pt-6 border-t border-primary/10">
              {activePopup.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-label text-[10px] uppercase tracking-wider px-3 py-1 bg-surface-container text-on-surface-variant rounded-full ghost-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
