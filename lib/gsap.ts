/**
 * Central GSAP setup — import gsap and ScrollTrigger from here everywhere.
 * The plugin is registered exactly once at module-load time.
 */
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
