"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenPlaying, setFullscreenPlaying] = useState(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // useReducedMotion returns null on first render - treat null as false so
  // we never accidentally suppress the play button or animations mid-paint.
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;
  const count = screenshots.length;

  // createPortal needs `document`, which doesn't exist during SSR - defer
  // the portal render until after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Sync playing state if the autoplay prop changes after mount.
  useEffect(() => {
    setPlaying(autoplay);
  }, [autoplay]);

  // Reset stale thumb refs when the screenshots array is swapped out.
  useEffect(() => {
    thumbRefs.current = thumbRefs.current.slice(0, screenshots.length);
  }, [screenshots]);

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
  // actually on screen - otherwise a scrolled-away instance still ticks and
  // its thumbnail auto-scroll yanks the page back into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // Use a higher threshold so autoplay and thumbnail scrolling only kick
      // in when most of the component (including the thumbnail strip) is
      // actually on screen. At 0.4 the strip was still off-screen, causing
      // scrollIntoView to pull the page down instead of scrolling the strip.
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Fullscreen is always "in view" by definition - arrow/escape keys must
    // keep working there even if the underlying page scroll position (frozen
    // behind the modal) would otherwise say the carousel isn't visible.
    if (!inView && !fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "Escape" && fullscreen) setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paginate, inView, fullscreen]);

  // Lock page scroll while the fullscreen lightbox is open, and return focus
  // to the trigger button on close (keyboard/screen-reader users don't lose
  // their place).
  useEffect(() => {
    if (!fullscreen) return;
    // Entering fullscreen always starts paused, regardless of whatever the
    // compact view's autoplay state was - fullscreen is for looking closely,
    // not being surprised by a slide change. The lightbox has its own toggle
    // to resume the slideshow.
    setFullscreenPlaying(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      expandBtnRef.current?.focus();
    };
  }, [fullscreen]);

  // Autoplay - paused on hover, out-of-view, or reduced motion. Fullscreen
  // uses its own independent playing flag (default off) instead of the
  // compact view's. Timer resets on any slide change (index in deps) so
  // manual nav doesn't cause a quick skip.
  useEffect(() => {
    const isPlaying = fullscreen ? fullscreenPlaying : playing;
    if (!isPlaying || hovered || !inView || reducedMotion || count < 2) return;
    const id = setInterval(() => {
      // Browsers keep intervals alive in background tabs - don't advance there
      if (!document.hidden) paginate(1);
    }, autoplayInterval);
    return () => clearInterval(id);
  }, [
    playing,
    fullscreenPlaying,
    fullscreen,
    hovered,
    inView,
    reducedMotion,
    count,
    index,
    paginate,
    autoplayInterval,
  ]);

  // Keep the active thumbnail centred inside the strip as slides change.
  // We scroll the *strip container* directly instead of calling scrollIntoView
  // on the button - scrollIntoView climbs to the nearest scrollable ancestor
  // in the block axis (the page) and would pull the whole page down whenever
  // the thumbnail strip is below the viewport.
  useEffect(() => {
    if (!inView) return;
    const strip = thumbStripRef.current;
    const thumb = thumbRefs.current[index];
    if (!strip || !thumb) return;
    const targetLeft =
      thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reducedMotion ? "auto" : "smooth",
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
              sizes="(max-width: 768px) 92vw, 72rem"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Preload the next slide so autoplay never shows a loading flash */}
        {count > 1 && (
          <Image
            src={screenshots[(index + 1) % count]}
            alt=""
            fill
            className="object-cover opacity-0 pointer-events-none"
            sizes="(max-width: 768px) 92vw, 72rem"
            aria-hidden="true"
          />
        )}

        {count > 1 && (
          <>
            {/* Prev / Next — smaller on mobile since swipe is the primary
                touch interaction here and these are a secondary affordance;
                still >=36px, comfortably above the 24px WCAG tap-target floor */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous screenshot"
              className={`${chipClass} absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 text-on-surface opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:border-primary/50 hover:text-primary focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
            >
              <span className="material-symbols-outlined text-lg md:text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next screenshot"
              className={`${chipClass} absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 text-on-surface opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:border-primary/50 hover:text-primary focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
            >
              <span className="material-symbols-outlined text-lg md:text-xl">chevron_right</span>
            </button>

            {/* Counter + play/pause */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 flex items-center gap-1.5 md:gap-2">
              {autoplay && prefersReducedMotion !== true && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className={`${chipClass} w-7 h-7 md:w-8 md:h-8 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                >
                  <span className="material-symbols-outlined text-sm md:text-base">
                    {playing ? "pause" : "play_arrow"}
                  </span>
                </button>
              )}
              <div
                className={`${chipClass} font-label text-[10px] md:text-[11px] uppercase tracking-wider px-2.5 md:px-3 py-1 md:py-1.5 text-on-surface-variant tabular-nums`}
              >
                {index + 1} / {count}
              </div>
              <button
                ref={expandBtnRef}
                type="button"
                onClick={() => setFullscreen(true)}
                aria-label="View fullscreen"
                className={`${chipClass} w-7 h-7 md:w-8 md:h-8 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
              >
                <span className="material-symbols-outlined text-sm md:text-base">
                  fullscreen
                </span>
              </button>
            </div>
          </>
        )}

        {/* Single-image projects still get fullscreen - just no nav chrome */}
        {count === 1 && (
          <button
            ref={expandBtnRef}
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="View fullscreen"
            className={`${chipClass} absolute top-3 right-3 md:top-4 md:right-4 z-10 w-7 h-7 md:w-8 md:h-8 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
          >
            <span className="material-symbols-outlined text-sm md:text-base">
              fullscreen
            </span>
          </button>
        )}
      </div>

      {/* Thumbnails or dots */}
      {count > 1 &&
        (thumbnails ? (
          <div
            ref={thumbStripRef}
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
                className={`group/thumb relative shrink-0 first:ml-auto last:mr-auto w-20 sm:w-24 md:w-28 aspect-video rounded-lg overflow-hidden transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
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
                  sizes="(max-width: 640px) 80px, 112px"
                />
                {i !== index && (
                  <span className="absolute inset-0 bg-[#0B0B0B]/20 group-hover/thumb:bg-transparent transition-colors duration-300" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-2.5 mt-5"
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
                // p-2.5 pads the tiny dot up to a >=24px tap target (WCAG 2.5.8)
                className="p-2.5 group/dot"
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

      {/* Fullscreen lightbox - portaled to <body> so it escapes any parent
          overflow-hidden/z-index and always covers the full viewport. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {fullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.2 }}
                className="fixed inset-0 z-[1000] bg-[#0B0B0B]/95 backdrop-blur-md flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-label={`${title} screenshot, fullscreen`}
                onClick={() => setFullscreen(false)}
              >
                {/* Close */}
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setFullscreen(false)}
                  aria-label="Close fullscreen view"
                  className={`${chipClass} absolute top-4 right-4 md:top-5 md:right-5 z-10 w-10 h-10 md:w-11 md:h-11 text-on-surface hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">close</span>
                </button>

                {count > 1 && (
                  <div className="absolute top-4 left-4 md:top-5 md:left-5 z-10 flex items-center gap-1.5 md:gap-2">
                    {!reducedMotion && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenPlaying((p) => !p);
                        }}
                        aria-label={
                          fullscreenPlaying
                            ? "Pause slideshow"
                            : "Play slideshow"
                        }
                        className={`${chipClass} w-8 h-8 md:w-9 md:h-9 text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                      >
                        <span className="material-symbols-outlined text-sm md:text-base">
                          {fullscreenPlaying ? "pause" : "play_arrow"}
                        </span>
                      </button>
                    )}
                    <div className="font-label text-[10px] md:text-[11px] uppercase tracking-wider px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-outline-variant/30 text-on-surface-variant tabular-nums">
                      {index + 1} / {count}
                    </div>
                  </div>
                )}

                {/* Image stage - stopPropagation so clicking the image itself
                    (vs. the backdrop) doesn't close the lightbox */}
                <div
                  className="relative flex-1 m-4 md:m-10"
                  onClick={(e) => e.stopPropagation()}
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
                        className="object-contain pointer-events-none"
                        sizes="100vw"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {count > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          paginate(-1);
                        }}
                        aria-label="Previous screenshot"
                        className={`${chipClass} absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 text-on-surface hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                      >
                        <span className="material-symbols-outlined text-lg md:text-xl">
                          chevron_left
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          paginate(1);
                        }}
                        aria-label="Next screenshot"
                        className={`${chipClass} absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 text-on-surface hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                      >
                        <span className="material-symbols-outlined text-lg md:text-xl">
                          chevron_right
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
