"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * AboutImage — portrait photo panel with:
 * - GSAP parallax scrolling
 * - Grayscale → colour on hover
 * - Golden overlay + bottom gradient
 */
export default function AboutImage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to("#about-img", {
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
      y: "-12%",
      ease: "none",
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Portrait */}
      <div
        id="about-img-wrap"
        className="relative group aspect-square overflow-hidden rounded-xl bg-surface-container"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="about-img"
          className="w-full h-[115%] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          style={{ transformOrigin: "center top" }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP2yA2Kpb8WrTsDMRRqvT9qyJSYN0L-o2y-SgwergaONCHFsE2ijNqtg-qOafjGNsx-C0H6wpGpIobGV7rlZqJtcQNSFzDGv7ARmEz2Y7326HNyTrrf1UNOHCAN5BKeZNYJVB5Y7JrbUCZuWCr5wOAdMOsg3ntm5WricfzF-JIh9JLRSl77MdsS3r_EX4rSxlAoT2XxcnxtWLyLWbw9PuKPbrVEgrT4M6vCLAAzNsjId5a2GzpKUs_rI75qfm8rCd8HajyZ1RtgBzf"
          alt="portrait"
        />
        {/* Golden tint overlay */}
        <div
          className="absolute inset-0 mix-blend-multiply group-hover:bg-transparent transition-colors duration-700"
          style={{ background: "rgba(200,169,126,0.1)" }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(19,19,19,0.7) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Social links */}
      <div className="flex items-center gap-6 py-2 gsap-fade">
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
            <span className="material-symbols-outlined text-base">{icon}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
