"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface ScreenshotCarouselProps {
  screenshots: string[];
  title: string;
  /** Auto-advance slides. Renders a play/pause control. Default: true */
  autoplay?: boolean;
  /** Milliseconds between auto-advances. Default: 2500 */
  autoplayInterval?: number;
  /** Show clickable thumbnail strip instead of dots. Default: false */
  thumbnails?: boolean;
}

const SWIPE_THRESHOLD = 50;

export default function ScreenshotCarousel({
  screenshots,
  title,
  autoplay = true,
  autoplayInterval = 2500,
  thumbnails = false,
}: ScreenshotCarouselProps) {
  const [[index, direction], setState] = useState([0, 0]);
  const [playing, setPlaying] = useState(autoplay);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const count = screenshots.length;

  const paginate = useCallback(
    (dir: number) => {
      setState(([i]) => [(i + dir + count) % count, dir]);
    },
    [count],
  );

  const goTo = useCallback((i: number) => {
    setState(([prev]) => [i, i > prev ? 1 : -1]);
  }, []);

  // Only run autoplay / respond to keyboard nav while the carousel is
  // actually on screen — otherwise a scrolled-away instance still ticks and
  // its thumbnail auto-scroll yanks the page back into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paginate, inView]);

  // Autoplay — paused on hover, out-of-view, or reduced motion. Timer resets
  // on any slide change (index in deps) so manual nav doesn't cause a quick skip.
  useEffect(() => {
    if (!playing || hovered || !inView || reducedMotion || count < 2) return;
    const id = setInterval(() => paginate(1), autoplayInterval);
    return () => clearInterval(id);
  }, [playing, hovered, inView, reducedMotion, count, index, paginate, autoplayInterval]);

  // Keep the active thumbnail in view as slides change — only while the
  // carousel itself is visible, so this never scrolls the page to it.
  useEffect(() => {
    if (!inView) return;
    thumbRefs.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, reducedMotion, inView]);

  if (count === 0) return null;

  const variants = {
    enter: (dir: number) => ({
      x: reducedMotion ? 0 : dir * 60,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.98,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: reducedMotion ? 0 : dir * -60,
      opacity: 0,
      scale: reducedMotion ? 1 : 0.98,
    }),
  };

  const chipClass =
    "flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-outline-variant/30";

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
    >
      {/* Viewport */}
      <div
        className="group relative aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden border border-outline-variant/20 bg-surface-container"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 32 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.3 },
            }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
              else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={screenshots[index]}
              alt={`${title} screenshot ${index + 1} of ${count}`}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, 72rem"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            {/* Prev / Next */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous screenshot"
              className={`${chipClass} absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 text-on-surface opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:border-primary/50 hover:text-primary focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next screenshot"
              className={`${chipClass} absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 text-on-surface opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:border-primary/50 hover:text-primary focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>

            {/* Counter + play/pause */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {autoplay && !reducedMotion && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className={`${chipClass} w-8 h-8 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                >
                  <span className="material-symbols-outlined text-base">
                    {playing ? "pause" : "play_arrow"}
                  </span>
                </button>
              )}
              <div
                className={`${chipClass} font-label text-[11px] uppercase tracking-wider px-3 py-1.5 text-on-surface-variant tabular-nums`}
              >
                {index + 1} / {count}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails or dots */}
      {count > 1 &&
        (thumbnails ? (
          <div
            className="flex gap-2.5 mt-6 overflow-x-auto py-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
            role="tablist"
            aria-label="Screenshot thumbnails"
          >
            {screenshots.map((src, i) => (
              <button
                key={i}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to screenshot ${i + 1}`}
                onClick={() => goTo(i)}
                // first/last auto margins center the strip when it doesn't
                // overflow, and collapse to 0 when it does (keeps scrollable)
                className={`group/thumb relative shrink-0 first:ml-auto last:mr-auto w-24 md:w-28 aspect-video rounded-lg overflow-hidden transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                  i === index
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0B0B0B]"
                    : "ring-1 ring-outline-variant/20 hover:ring-primary/40"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className={`object-cover transition-all duration-300 ${
                    i === index
                      ? "grayscale-0 opacity-100"
                      : "grayscale opacity-40 group-hover/thumb:grayscale-0 group-hover/thumb:opacity-75"
                  }`}
                  sizes="112px"
                />
                {i !== index && (
                  <span className="absolute inset-0 bg-[#0B0B0B]/20 group-hover/thumb:bg-transparent transition-colors duration-300" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-2 mt-5"
            role="tablist"
            aria-label="Screenshot navigation"
          >
            {screenshots.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to screenshot ${i + 1}`}
                onClick={() => goTo(i)}
                className="p-2 group/dot"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-outline-variant/40 group-hover/dot:bg-primary/50"
                  }`}
                />
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}
