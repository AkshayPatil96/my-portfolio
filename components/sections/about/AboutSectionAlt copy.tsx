"use client";

/**
 * AboutSectionAlt — alternate about section without skill bars.
 *
 * Layout: asymmetric two-column at desktop.
 * Left: portrait with layered overlays + social links.
 * Right: headline (SplitType reveal), bio, animated stat counters,
 *        core stack badges, and a short values row.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { coreStack } from "@/lib/data";
import { calculateExperience } from "@/lib/utils";

const STATS = [
  { value: 3.5, suffix: "+", label: "Years in Production" },
  { value: 20, suffix: "+", label: "Projects Shipped" },
  { value: 8, suffix: "", label: "Core Technologies" },
];

const VALUES = [
  { icon: "code", label: "Clean Architecture" },
  { icon: "speed", label: "Performance First" },
  { icon: "precision_manufacturing", label: "Detail Oriented" },
  { icon: "handshake", label: "Team Player" },
];

export default function AboutSectionAlt() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Portrait parallax
      gsap.to("#alt-about-img", {
        scrollTrigger: {
          trigger: "#about-alt",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        y: "-10%",
        ease: "none",
      });

      // Title reveal
      ScrollTrigger.create({
        trigger: "#alt-about-title",
        start: "top 82%",
        once: true,
        onEnter() {
          const split = new SplitType("#alt-about-title", { types: "lines" });
          gsap.set("#alt-about-title", { opacity: 1 });
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

      // Animated stat counters
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = STATS[i].value;
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter() {
            gsap.fromTo(
              el,
              { innerText: 0 },
              {
                innerText: target,
                duration: 1.8,
                ease: "power2.out",
                snap: { innerText: target % 1 === 0 ? 1 : 0.5 },
                onUpdate() {
                  el.innerText = parseFloat(el.innerText).toFixed(
                    target % 1 !== 0 ? 1 : 0,
                  );
                },
              },
            );
          },
        });
      });

      // Generic fade-ups
      document
        .querySelectorAll<HTMLElement>("#about-alt .gsap-fade")
        .forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            y: 36,
            opacity: 0,
            duration: 0.85,
            delay: parseFloat(el.dataset.delay ?? "0"),
            ease: "power3.out",
          });
        });

      // Stack badge stagger
      ScrollTrigger.create({
        trigger: "#alt-core-stack",
        start: "top 88%",
        once: true,
        onEnter() {
          gsap.from("#alt-core-stack .stack-badge", {
            y: 16,
            opacity: 0,
            scale: 0.85,
            stagger: 0.07,
            duration: 0.55,
            ease: "back.out(1.6)",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="max-w-[1920px] mx-auto px-8 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 xl:gap-36">
          {/* ── Left column: portrait ─────────────────────────── */}
          <div className="w-full lg:w-[50%] flex flex-col gap-8 flex-shrink-0">
            {/* Portrait */}
            <div className="relative group aspect-[5/4] overflow-hidden rounded-2xl bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="alt-about-img"
                className="w-full h-[115%] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{ transformOrigin: "center top" }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP2yA2Kpb8WrTsDMRRqvT9qyJSYN0L-o2y-SgwergaONCHFsE2ijNqtg-qOafjGNsx-C0H6wpGpIobGV7rlZqJtcQNSFzDGv7ARmEz2Y7326HNyTrrf1UNOHCAN5BKeZNYJVB5Y7JrbUCZuWCr5wOAdMOsg3ntm5WricfzF-JIh9JLRSl77MdsS3r_EX4rSxlAoT2XxcnxtWLyLWbw9PuKPbrVEgrT4M6vCLAAzNsjId5a2GzpKUs_rI75qfm8rCd8HajyZ1RtgBzf"
                alt="portrait"
              />
              {/* Tint */}
              <div
                className="absolute inset-0 mix-blend-multiply group-hover:bg-transparent transition-colors duration-700"
                style={{ background: "rgba(200,169,126,0.08)" }}
              />
              {/* Bottom gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(14,12,10,0.75) 0%, transparent 55%)",
                }}
              />
              {/* Name plate */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="font-headline text-2xl font-bold text-on-surface leading-tight">
                  Full-Stack Developer
                </p>
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/70 mt-1">
                  MERN · AWS · TypeScript
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-6 py-1 gsap-fade">
              {[
                { label: "LinkedIn", icon: "arrow_outward", href: "#" },
                { label: "GitHub", icon: "terminal", href: "#" },
                { label: "Twitter", icon: "history_edu", href: "#" },
              ].map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-300 mag-btn"
                >
                  <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                    {label}
                  </span>
                  <span className="material-symbols-outlined text-base">
                    {icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Right column: content ─────────────────────────── */}
          <div className="flex-1 flex flex-col">
            {/* Label */}
            <div className="flex items-center gap-4 mb-8 gsap-fade">
              <span className="font-label text-primary text-sm tracking-[0.3em] font-bold">
                02 / ABOUT
              </span>
              <div className="h-[0.5px] w-10 bg-outline-variant/30" />
            </div>

            {/* Headline */}
            <h2
              id="alt-about-title"
              className="font-headline text-5xl md:text-6xl lg:text-7xl text-on-surface leading-[1.05] mb-10 tracking-tight"
              style={{ opacity: 0 }}
            >
              Code, Café &amp; <em className="text-primary">Beyond.</em>
            </h2>

            {/* Bio */}
            <div className="mb-14">
              <p className="gsap-fade text-on-surface-variant text-base md:text-lg leading-relaxed font-light">
                I’m a full-stack developer building production-grade
                applications with 3.5+ years of experience.
                <br />
                Before tech, I ran a café — where I learned how to solve
                real-world problems, handle pressure, and deliver consistently.
                That mindset still drives how I build software today.
                <br />I don’t just build features — I design systems that hold
                up in production, using Node.js, Next.js, and AWS.
              </p>
            </div>

            <div className="w-full h-[0.5px] bg-outline-variant/20 mb-12 gsap-fade" />

            {/* ── Core stack ───────────────────────────── */}
            <div
              className="mb-12 gsap-fade"
              data-delay="0.05"
            >
              <h3 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4">
                Core Stack
              </h3>
              <div
                id="alt-core-stack"
                className="flex flex-wrap gap-2"
              >
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

            {/* ── Values row ───────────────────────────── */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 gsap-fade"
              data-delay="0.1"
            >
              {VALUES.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low ghost-border"
                >
                  <span className="material-symbols-outlined text-primary/70 text-lg flex-shrink-0">
                    {icon}
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
