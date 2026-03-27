"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SECTIONS } from "@/lib/data";
import { scrollTo } from "@/lib/lenisStore";

const NAV_SECTIONS = ["hero", "expertise", "about", "work", "experience", "contact"];

export default function sFilmStrip() {
  useEffect(() => {


    const fsDots = document.querySelectorAll<HTMLButtonElement>(".fs-dot");
    const secNum = document.getElementById("section-num");

    SECTIONS.forEach(({ id, label }) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        onEnter: () => {
          if (secNum) secNum.textContent = label;
          fsDots.forEach((d) =>
            d.classList.toggle("active", d.dataset.section === id),
          );
        },
        onEnterBack: () => {
          if (secNum) secNum.textContent = label;
          fsDots.forEach((d) =>
            d.classList.toggle("active", d.dataset.section === id),
          );
        },
      });
    });

    const clickHandlers: Array<{ el: HTMLButtonElement; fn: () => void }> = [];
    fsDots.forEach((dot) => {
      const fn = () => {
        const t = document.getElementById(dot.dataset.section ?? "");
        if (t) scrollTo(t, { offset: -80 });
      };
      dot.addEventListener("click", fn);
      clickHandlers.push({ el: dot, fn });
    });

    return () => {
      clickHandlers.forEach(({ el, fn }) =>
        el.removeEventListener("click", fn),
      );
    };
  }, []);

  return (
    <div
      id="film-strip"
      className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-40"
      style={{ opacity: 0 }}
    >
      <div className="w-px h-8 bg-outline-variant/20" />
      {NAV_SECTIONS.map((id) => (
        <button
          key={id}
          data-section={id}
          className={`fs-dot ${id === "hero" ? "active" : ""}`}
          aria-label={id.charAt(0).toUpperCase() + id.slice(1)}
        />
      ))}
      <div className="w-px h-8 bg-outline-variant/20" />
    </div>
  );
}
