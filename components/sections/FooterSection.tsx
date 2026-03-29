"use client";

import { scrollTo } from "@/lib/lenisStore";

export default function FooterSection() {
  return (
    <footer
      className="py-16 md:py-20 px-8 md:px-12 border-t border-white/5"
      // style={{ background: "#0e0e0e" }}
    >
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Social links */}
        <div className="flex gap-4 md:gap-6 order-2 md:order-1">
          {[
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/aksh2706/",
            },
            { label: "GitHub", href: "https://github.com/AkshayPatil96" },
            { label: "Resume", href: "https://read.cv/AkshayPatil96" },
            { label: "Email", href: "mailto:aksh.patil2706@gmail.com" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-label tracking-[0.2em] text-[12px] text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Credit */}
        <div className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant text-center order-1 md:order-2">
          Designed &amp; built by Akshay · 2026
        </div>

        {/* Back to top */}
        <div className="order-3">
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      href="#hero"
      onClick={handleClick}
      className="flex items-center gap-2 font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant hover:text-primary transition-colors duration-300"
    >
      Back to top
      <span className="material-symbols-outlined text-xs">north</span>
    </a>
  );
}
