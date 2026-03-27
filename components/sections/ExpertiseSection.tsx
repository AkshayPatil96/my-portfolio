"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import TerminalBlock from "@/components/TerminalBlock";

export default function ExpertiseSection() {
  useEffect(() => {


    const ctx = gsap.context(() => {
      // Fade-up on gsap-fade elements within this section
      document
        .querySelectorAll<HTMLElement>("#expertise .gsap-fade")
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
      id="expertise"
      className="py-32 lg:py-40 px-8 lg:px-12 bg-surface-container-lowest overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
        <div className="lg:col-span-7 gsap-fade">
          <span className="font-label text-xs uppercase tracking-widest text-primary mb-6 block">
            01 // Expertise
          </span>
          <h2 className="font-headline text-4xl lg:text-5xl leading-tight text-on-surface">
            Engineering production-grade systems built for scale and
            reliability.
          </h2>
          <ul className="mt-8 space-y-1 text-lg text-on-surface-variant list-disc list-inside">
            <li className="">
              Building scalable APIs and backend architectures
            </li>
            <li className="">
              Designing performant frontend applications with Next.js, Vue.js
            </li>
            <li className="">
              Optimizing systems for real-world traffic and usage
            </li>
            <li className="">
              Implementing caching, rate limiting, and efficient data flows
            </li>
          </ul>
        </div>

        <div
          className="lg:col-span-5 gsap-fade"
          data-delay="0.2"
        >
          <TerminalBlock />
        </div>
      </div>
    </section>
  );
}
