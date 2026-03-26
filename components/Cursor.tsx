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

    const interactables = document.querySelectorAll(
      "a, button, .mag-btn, .fs-dot"
    );
    const addHover = (el: Element) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("cursor-hover")
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("cursor-hover")
      );
    };
    interactables.forEach(addHover);

    // Magnetic buttons
    const magBtns = document.querySelectorAll<HTMLElement>(".mag-btn");
    const magHandlers: Array<{
      el: HTMLElement;
      move: (e: Event) => void;
      leave: () => void;
    }> = [];

    magBtns.forEach((btn) => {
      const move = (e: Event) => {
        const me = e as MouseEvent;
        const r = btn.getBoundingClientRect();
        const dx = (me.clientX - r.left - r.width / 2) * 0.28;
        const dy = (me.clientY - r.top - r.height / 2) * 0.28;
        gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
      };
      const leave = () =>
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);
      magHandlers.push({ el: btn, move, leave });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tickFn);
      magHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <>
      <div id="cursor-outer" />
      <div id="cursor-dot" />
    </>
  );
}
