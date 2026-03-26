"use client";

import { usePathname, useRouter } from "next/navigation";
import { scrollTo } from "@/lib/lenisStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();

    // Extract the hash portion (e.g. "#about" from "/#about")
    const hash = href.includes("#") ? `#${href.split("#")[1]}` : href;

    if (pathname === "/") {
      // On home page — smooth scroll to the section
      const target = document.querySelector(hash);
      if (target) scrollTo(target as HTMLElement, { offset: -80 });
    } else {
      // On another page — navigate home, browser will scroll to hash
      router.push(`/${hash}`);
    }
  };

  return (
    <nav
      id="top-nav"
      className="fixed top-0 w-full z-50 glass-header"
      style={{ opacity: 0, transform: "translateY(-100%)" }}
    >
      <div className="flex justify-between items-center px-8 md:px-12 py-5 max-w-[1920px] mx-auto">
        <a
          href="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="text-xl md:text-2xl font-bold tracking-tighter text-[#c8a97e] font-headline"
        >
          akshay.dev
        </a>

        <div className="hidden md:flex items-center gap-10 lg:gap-12">
          {[
            { href: "/#about", label: "About" },
            { href: "/#work", label: "Work" },
            { href: "/#experience", label: "Experience" },
            { href: "/#contact", label: "Contact" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="nav-link mag-btn font-label uppercase tracking-widest text-xs text-on-surface-variant/70 hover:text-on-surface transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <button className="mag-btn bg-primary text-on-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-label text-xs uppercase tracking-widest">
          Hire Me
        </button>
      </div>
    </nav>
  );
}
