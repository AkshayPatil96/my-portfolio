"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function Cursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const outer = document.getElementById("cursor-outer");
    const dot = document.getElementById("cursor-dot");
    if (!outer || !dot) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ox = mx;
    let oy = my;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const tickFn = () => {
      ox += (mx - ox) * 0.14;
      oy += (my - oy) * 0.14;
      gsap.set(outer, { x: ox, y: oy });
      gsap.set(dot, { x: mx, y: my });
    };
    gsap.ticker.add(tickFn);

    // Delegated cursor-hover state — works for any elements added after navigation
    const INTERACTIVE = "a, button, .mag-btn, .fs-dot";
    const onDocOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE))
        document.body.classList.add("cursor-hover");
    };
    const onDocOut = (e: MouseEvent) => {
      if (!(e.target as Element).closest(INTERACTIVE)) return;
      const related = e.relatedTarget as Element | null;
      if (!related || !related.closest(INTERACTIVE))
        document.body.classList.remove("cursor-hover");
    };
    document.addEventListener("mouseover", onDocOver);
    document.addEventListener("mouseout", onDocOut);

    // Delegated magnetic effect — picks up .mag-btn elements on every page
    const onMagMove = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>(".mag-btn");
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.28;
      const dy = (e.clientY - r.top - r.height / 2) * 0.28;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };
    const onMagOut = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>(".mag-btn");
      if (!btn) return;
      const related = e.relatedTarget as Element | null;
      if (!related || !btn.contains(related))
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    };
    document.addEventListener("mousemove", onMagMove);
    document.addEventListener("mouseout", onMagOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tickFn);
      document.removeEventListener("mouseover", onDocOver);
      document.removeEventListener("mouseout", onDocOut);
      document.removeEventListener("mousemove", onMagMove);
      document.removeEventListener("mouseout", onMagOut);
    };
  }, []);

  return (
    <>
      <div id="cursor-outer" />
      <div id="cursor-dot" />
    </>
  );
}
