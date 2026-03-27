"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitType from "split-type";

const CORE_STACK = [
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Prisma",
];

const CAPABILITIES = [
  {
    icon: "architecture",
    title: "Clean Architecture",
    description:
      "Designing modular and maintainable systems built for long-term scalability.",
  },
  {
    icon: "bolt",
    title: "Performance First",
    description:
      "Optimizing critical paths to ensure fast, reliable user experiences at scale.",
  },
  {
    icon: "hub",
    title: "System Thinking",
    description:
      "Building systems with a focus on scalability, reliability, and failure handling.",
  },
  {
    icon: "grid_view",
    title: "Detail Oriented",
    description:
      "Delivering precise implementations — from UI polish to backend efficiency.",
  },
];

export default function AboutSectionAlt() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {


    const ctx = gsap.context(() => {
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

      // Generic fade-ups
      document
        .querySelectorAll<HTMLElement>("#about .gsap-fade")
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
      className="py-24 md:py-32 bg-[#0B0B0B] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-8 lg:gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-0 lg:gap-y-6">
          {/* Label — mobile: 1st, desktop: right col row 1 */}
          <div className="lg:col-start-7 lg:col-span-6 lg:row-start-1 gsap-fade">
            <span className="font-label text-primary/70 text-xs uppercase tracking-[0.3em]">
              02 / About
            </span>
          </div>

          {/* Headline — mobile: 2nd, desktop: right col row 2 */}
          <div className="lg:col-start-7 lg:col-span-6 lg:row-start-2">
            <h2
              id="alt-about-title"
              className="font-headline text-5xl md:text-6xl text-on-surface leading-[1.08] tracking-tight"
              style={{ opacity: 0 }}
            >
              Code, Caf&eacute; &amp;{" "}
              <em className="text-primary not-italic">Beyond.</em>
            </h2>
          </div>

          {/* Profile card — mobile: 3rd, desktop: left col spanning all rows */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-4 gsap-fade">
            <div className="relative group rounded-2xl overflow-hidden bg-surface-container h-full">
              <img
                src="/assets/images/profile.png"
                alt="Akshay — Production Systems Engineer"
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Overlay content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-2">
                  PRODUCTION SYSTEMS ENGINEER
                </p>
                <p className="text-lg md:text-xl text-white font-medium">
                  Node.js &middot; Next.js &middot; AWS
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  Based in Pune, India &middot; Open to Relocation / Remote
                </p>

                {/* Social links */}
                <div className="flex items-center gap-5 mt-5 pt-4 border-t border-white/10">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-neutral-400 hover:text-primary transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-sm">
                      link
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em]">
                      LinkedIn
                    </span>
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-neutral-400 hover:text-primary transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-sm">
                      terminal
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em]">
                      GitHub
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bio — mobile: 4th, desktop: right col row 3 */}
          <div
            className="lg:col-start-7 lg:col-span-6 lg:row-start-3 max-w-[520px] space-y-6 gsap-fade"
            data-delay="0.1"
          >
            <p className="text-neutral-300 leading-relaxed">
              I&apos;m a full-stack developer with 3.5+ years of experience
              building production-grade applications.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              Before tech, I ran a caf&eacute; — where I learned how to solve
              real-world problems, handle pressure, and deliver consistently.
              That mindset still drives how I build software today.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              I don&apos;t just build features — I design systems that hold up
              in production, focusing on performance, scalability, and clean
              architecture using Node.js, Next.js, and AWS.
            </p>
          </div>

          {/* Core stack — mobile: 5th, desktop: right col row 4 */}
          <div
            className="lg:col-start-7 lg:col-span-6 lg:row-start-4 gsap-fade"
            data-delay="0.15"
          >
            <h3 className="font-label text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Core Stack
            </h3>
            <div
              id="alt-core-stack"
              className="flex flex-wrap gap-3"
            >
              {CORE_STACK.map((tech) => (
                <span
                  key={tech}
                  className="stack-badge px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900 font-label text-sm text-neutral-300 hover:border-primary hover:text-primary transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Capability cards — mobile: 6th, desktop: right col row 5 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gsap-fade"
          data-delay="0.2"
        >
          {CAPABILITIES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-primary/80 text-xl mb-3 block">
                {icon}
              </span>
              <h4 className="text-lg font-medium text-on-surface mb-1">
                {title}
              </h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
