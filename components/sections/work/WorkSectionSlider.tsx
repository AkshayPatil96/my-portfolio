"use client";

/**
 * WorkSectionSlider — One card per scroll step.
 *
 * The section is pinned for (n × 100vh) of scroll. Each scroll
 * "page" transitions to the next card: outgoing card exits up,
 * incoming card enters from below.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

export default function WorkSectionSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const n = projects.length;
    const cardEls = gsap.utils.toArray<HTMLElement>(".wss-card");

    // First card visible; rest hidden below
    gsap.set(cardEls, { autoAlpha: 0, y: 60 });
    gsap.set(cardEls[0], { autoAlpha: 1, y: 0 });

    // Build a scrubbed timeline: each pair is exit → enter
    const tl = gsap.timeline({ paused: true });
    for (let i = 0; i < n - 1; i++) {
      tl.to(cardEls[i], {
        autoAlpha: 0,
        y: -60,
        duration: 0.4,
        ease: "power2.in",
      }).fromTo(
        cardEls[i + 1],
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }

    const updateUI = (idx: number) => {
      if (counterRef.current) {
        counterRef.current.textContent = String(idx + 1).padStart(2, "0");
      }
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.opacity = i === idx ? "1" : "0.25";
        dot.style.transform = i === idx ? "scaleY(2.5)" : "scaleY(1)";
      });
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * n}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate(self) {
          updateUI(Math.min(Math.floor(self.progress * n), n - 1));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full h-screen overflow-hidden bg-surface-container-lowest flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-10 md:px-20 pt-16 pb-8 flex items-end justify-between">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.35em] text-primary/50 mb-3">
            03 — Selected Work
          </p>
          <h2 className="font-headline font-bold text-on-surface text-4xl md:text-6xl tracking-tighter leading-none">
            Projects
          </h2>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1 font-label font-light tracking-tighter opacity-20">
            <span
              ref={counterRef}
              className="text-4xl"
            >
              01
            </span>
            <span className="text-2xl opacity-60">/</span>
            <span className="text-4xl">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            Project / Total
          </p>
        </div>
      </div>

      {/* Card stage */}
      <div className="flex-1 relative overflow-hidden px-10 md:px-20 pb-12">
        {/* Side progress dots */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-[6px] z-10">
          {projects.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                dotsRef.current[i] = el;
              }}
              className="w-[3px] h-[14px] rounded-full bg-primary transition-all duration-300 origin-center"
              style={{
                opacity: i === 0 ? 1 : 0.25,
                transform: i === 0 ? "scaleY(2.5)" : "scaleY(1)",
              }}
            />
          ))}
        </div>

        {/* Stacked cards — all absolute, centred */}
        <div className="relative h-full max-w-2xl mx-auto">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="wss-card absolute inset-0 flex items-center"
            >
              <div className="w-full">
                <ProjectCard
                  project={project}
                  index={i}
                  total={projects.length}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.04]">
        <div
          id="slider-progress"
          className="h-full bg-primary/35 origin-left"
          style={{ width: "0%" }}
        />
      </div>
    </section>
  );
}

///////////////////////////////////////////////////////////////////////

// "use client";

// /**
//  * WorkSectionSlider — One card per scroll step.
//  *
//  * The section is pinned for (n × 100vh) of scroll. Each scroll
//  * "page" transitions to the next card: outgoing card exits up,
//  * incoming card enters from below.
//  */

// import { useEffect, useRef } from "react";
// import { gsap, ScrollTrigger } from "@/lib/gsap";
// import { projects } from "@/lib/data";
// import ProjectCard from "./ProjectCard";

// export default function WorkSectionSlider() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const counterRef = useRef<HTMLSpanElement>(null);
//   const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     const n = projects.length;
//     const cardEls = gsap.utils.toArray<HTMLElement>(".wss-card");
//     const progressBar = document.getElementById("slider-progress");

//     // First card visible; rest hidden below
//     gsap.set(cardEls, { autoAlpha: 0, y: 40, scale: 0.97 });
//     gsap.set(cardEls[0], { autoAlpha: 1, y: 0, scale: 1 });

//     // Build timeline: overlap exit/enter so there's no dead zone
//     const tl = gsap.timeline({ paused: true });
//     for (let i = 0; i < n - 1; i++) {
//       const pos = i * 1; // each transition occupies 1 unit of timeline
//       tl.to(cardEls[i], {
//         autoAlpha: 0,
//         y: -30,
//         scale: 0.97,
//         duration: 0.5,
//         ease: "none",
//       }, pos)
//         .fromTo(
//           cardEls[i + 1],
//           { autoAlpha: 0, y: 40, scale: 0.97 },
//           { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "none" },
//           pos
//         );
//     }

//     const updateUI = (progress: number) => {
//       const idx = Math.min(Math.floor(progress * n), n - 1);
//       if (counterRef.current) {
//         counterRef.current.textContent = String(idx + 1).padStart(2, "0");
//       }
//       dotsRef.current.forEach((dot, i) => {
//         if (!dot) return;
//         dot.style.opacity = i === idx ? "1" : "0.25";
//         dot.style.transform = i === idx ? "scaleY(2.5)" : "scaleY(1)";
//       });
//       if (progressBar) {
//         progressBar.style.width = `${progress * 100}%`;
//       }
//     };

//     const ctx = gsap.context(() => {
//       ScrollTrigger.create({
//         trigger: containerRef.current,
//         start: "top top",
//         end: () => `+=${window.innerHeight * n}`,
//         pin: true,
//         anticipatePin: 1,
//         scrub: 0.4,
//         animation: tl,
//         snap: {
//           snapTo: 1 / (n - 1),
//           duration: { min: 0.25, max: 0.6 },
//           ease: "power1.inOut",
//         },
//         invalidateOnRefresh: true,
//         onUpdate(self) {
//           updateUI(self.progress);
//         },
//       });
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={containerRef}
//       id="work"
//       className="relative w-full h-screen overflow-hidden bg-surface-container-lowest flex flex-col"
//     >
//       {/* Header */}
//       <div className="flex-shrink-0 px-10 md:px-20 pt-16 pb-8 flex items-end justify-between">
//         <div>
//           <p className="font-label text-[10px] uppercase tracking-[0.35em] text-primary/50 mb-3">
//             03 — Selected Work
//           </p>
//           <h2 className="font-headline font-bold text-on-surface text-4xl md:text-6xl tracking-tighter leading-none">
//             Projects
//           </h2>
//         </div>
//         <div className="hidden md:flex flex-col items-end gap-1">
//           <div className="flex items-baseline gap-1 font-label font-light tracking-tighter opacity-20">
//             <span ref={counterRef} className="text-4xl">01</span>
//             <span className="text-2xl opacity-60">/</span>
//             <span className="text-4xl">{String(projects.length).padStart(2, "0")}</span>
//           </div>
//           <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
//             Project / Total
//           </p>
//         </div>
//       </div>

//       {/* Card stage */}
//       <div className="flex-1 relative overflow-hidden px-10 md:px-20 pb-12">
//         {/* Side progress dots */}
//         <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-[6px] z-10">
//           {projects.map((_, i) => (
//             <div
//               key={i}
//               ref={(el) => { dotsRef.current[i] = el; }}
//               className="w-[3px] h-[14px] rounded-full bg-primary transition-all duration-300 origin-center"
//               style={{ opacity: i === 0 ? 1 : 0.25, transform: i === 0 ? "scaleY(2.5)" : "scaleY(1)" }}
//             />
//           ))}
//         </div>

//         {/* Stacked cards — all absolute, centred */}
//         <div className="relative h-full max-w-2xl mx-auto">
//           {projects.map((project, i) => (
//             <div
//               key={project.id}
//               className="wss-card absolute inset-0 flex items-center"
//             >
//               <div className="w-full">
//                 <ProjectCard project={project} index={i} total={projects.length} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Progress bar at very bottom */}
//       <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.04]">
//         <div
//           id="slider-progress"
//           className="h-full bg-primary/35 origin-left"
//           style={{ width: "0%" }}
//         />
//       </div>
//     </section>
//   );
// }
