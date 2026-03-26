"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { scrollTo } from "@/lib/lenisStore";

export default function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const overlay = overlayRef.current;
    const counter = counterRef.current;
    if (!overlay || !counter) return;

    const nav = document.getElementById("top-nav");
    const strip = document.getElementById("film-strip");

    gsap.set("#hero-overline", { y: 12 });
    gsap.set("#hero-sub", { y: 22, opacity: 0 });
    gsap.set("#hero-ctas", { y: 16, opacity: 0 });

    const obj = { val: 0 };

    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        overlay.style.display = "none";
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      },
    });

    tl.to(counter, { opacity: 1, duration: 0.25 })
      .to(obj, {
        val: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate() {
          counter.textContent = String(Math.round(obj.val)).padStart(2, "0");
        },
      })
      .to(counter, { opacity: 0, y: -18, duration: 0.35, ease: "power2.in" }, "-=0.1")
      .to(
        overlay,
        { scaleY: 0, transformOrigin: "top", duration: 0.75, ease: "power4.inOut" },
        "-=0.05"
      )
      .to(nav, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.35")
      .to(strip, { opacity: 1, duration: 0.5 }, "-=0.2")
      .to("#hero-overline", { opacity: 0.8, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
      .add(() => {
        const split = new SplitType("#hero-title", { types: "chars,words" });
        gsap.set("#hero-title", { opacity: 1 });
        gsap.from(split.chars, {
          y: 90,
          opacity: 0,
          rotateX: -50,
          stagger: 0.02,
          duration: 0.75,
          ease: "power3.out",
          transformOrigin: "50% 100%",
        });
      }, "-=0.3")
      .to("#hero-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "+=0.05")
      .to("#hero-ctas", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
      .to("#hero-badge", { opacity: 1, duration: 0.5 }, "-=0.2")
      .to("#hero-scroll", { opacity: 1, duration: 0.5 }, "-=0.3");

    return () => { tl.kill(); };
  }, []);

  // Smooth scroll for nav links (delegated here after overlay is done)
  useEffect(() => {
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
    const handlers: Array<{ el: HTMLAnchorElement; fn: (e: Event) => void }> = [];

    navLinks.forEach((link) => {
      const fn = (e: Event) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href") ?? "");
        if (target) scrollTo(target as HTMLElement, { offset: -80 });
      };
      link.addEventListener("click", fn);
      handlers.push({ el: link, fn });
    });

    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
    };
  }, []);

  return (
    <div id="intro-overlay" ref={overlayRef}>
      <span id="intro-counter" ref={counterRef}>00</span>
    </div>
  );
}
