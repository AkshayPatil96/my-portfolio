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
        <div className="flex gap-6 md:gap-8 order-2 md:order-1">
          {[
            { label: "LinkedIn", href: "#" },
            { label: "GitHub", href: "#" },
            { label: "ReadCV", href: "#" },
            { label: "Email", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant hover:text-primary transition-colors duration-300"
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
    const hero = document.getElementById("hero");
    if (hero) scrollTo(hero);
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
