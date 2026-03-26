"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { scrollTo } from "@/lib/lenisStore";
import { calculateExperience } from "@/lib/utils";

export default function HeroSection() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero glow parallax
      gsap.to("#hero-glow", {
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
        y: 180,
        x: -60,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleViewWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("work");
    if (target) scrollTo(target, { offset: -80 });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-75px)] md:min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Glow */}
      <div
        id="hero-glow"
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,169,126,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
          marginRight: "-10rem",
          marginTop: "-10rem",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center flex flex-col items-center">
        <span
          id="hero-overline"
          className="font-label text-xs md:text-sm uppercase tracking-[0.08em] text-primary mb-5 md:mb-10 block"
          style={{ opacity: 0 }}
        >
          Product-focused Full Stack Developer
        </span>

        <h1
          id="hero-title"
          className="font-headline text-[clamp(3.5rem,10vw,9.5rem)] leading-[1] md:leading-[0.9] tracking-tighter mb-6 md:mb-12"
          style={{ opacity: 0 }}
        >
          <span className="block">Building products</span>
          <span className="block text-on-surface-variant/40 italic">
            that scale reliably.
          </span>
        </h1>

        <p
          id="hero-sub"
          className="text-on-surface-variant max-w-2xl text-lg md:text-xl font-light leading-relaxed mb-6 md:mb-12"
          style={{ opacity: 0 }}
        >
          {calculateExperience()} years experience • Built production-grade
          applications
        </p>

        <div
          id="hero-ctas"
          className="flex flex-col md:flex-row gap-4 md:gap-6 items-center"
          style={{ opacity: 0 }}
        >
          <a
            href="#work"
            onClick={handleViewWork}
            className="mag-btn px-10 py-4 bg-surface-container-high text-on-surface font-label text-sm uppercase tracking-widest rounded-full ghost-border"
          >
            View Work →
          </a>
          <button className="mag-btn px-10 py-4 bg-primary text-on-primary font-label text-sm uppercase tracking-widest rounded-full">
            Resume
          </button>
        </div>
      </div>

      {/* Available badge */}
      <div
        id="hero-badge"
        className="absolute bottom-12 left-8 md:left-12 flex items-center gap-3"
        style={{ opacity: 0 }}
      >
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </div>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          Available for work
        </span>
      </div>

      {/* Scroll indicator */}
      <div
        id="hero-scroll"
        className="absolute bottom-12 right-8 md:right-12 flex flex-col items-center gap-3"
        style={{ opacity: 0 }}
      >
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant [writing-mode:vertical-lr] rotate-180">
          scroll
        </span>
        <div className="w-[0.5px] h-20 bg-outline-variant/30" />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('/assets/hero-bg/bg12.jpg')] bg-cover bg-no-repeat" />
    </section>
  );
}
