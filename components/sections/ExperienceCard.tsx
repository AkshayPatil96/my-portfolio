"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Experience } from "@/lib/data";

interface ExperienceCardProps {
  experience: Experience;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export default function ExperienceCard({
  experience: exp,
  isExpanded,
  onExpand,
  onCollapse,
}: ExperienceCardProps) {
  const toggle = useCallback(() => {
    isExpanded ? onCollapse() : onExpand();
  }, [isExpanded, onExpand, onCollapse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && isExpanded) onCollapse();
    },
    [toggle, isExpanded, onCollapse],
  );

  return (
    <motion.div
      className="relative rounded-xl cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/40 group"
      style={{
        background: "rgba(14,14,14,0.60)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isExpanded
          ? "0.5px solid rgba(229,196,151,0.2)"
          : "0.5px solid rgba(78,69,59,0.25)",
      }}
      animate={{
        scale: isExpanded ? 1.02 : 1,
        boxShadow: isExpanded
          ? "0 0 48px rgba(229,196,151,0.1), 0 24px 48px rgba(0,0,0,0.7)"
          : "0 2px 16px rgba(0,0,0,0.4)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      // Desktop: hover
      onHoverStart={onExpand}
      onHoverEnd={onCollapse}
      // Mobile + keyboard
      onClick={toggle}
      onFocus={onExpand}
      onBlur={onCollapse}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
    >
      {/* Gold top-edge accent */}
      <motion.div
        className="absolute top-0 left-8 right-8 h-px rounded-full"
        animate={{
          background: isExpanded
            ? "linear-gradient(90deg, transparent, rgba(229,196,151,0.55), transparent)"
            : "linear-gradient(90deg, transparent, rgba(229,196,151,0), transparent)",
        }}
        transition={{ duration: 0.35 }}
      />

      <div className="p-8 md:p-10">
        {/* ── Default content ── */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <span
            className="font-label text-[12px] uppercase tracking-[0.25em]"
            style={{
              color: exp.isCurrent ? "#e5c497" : "#e5c49790",
            }}
          >
            {exp.label}
          </span>
          {/* Expand indicator */}
          <motion.span
            className="material-symbols-outlined text-base flex-shrink-0"
            style={{ color: "rgba(229,196,151,0.4)" }}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            keyboard_arrow_down
          </motion.span>
        </div>

        <motion.h3
          className="font-headline text-2xl md:text-3xl font-bold mb-1"
          animate={{ color: isExpanded ? "#e5c497" : "#e5e2e1" }}
          transition={{ duration: 0.25 }}
        >
          {exp.title}
        </motion.h3>

        <p className="text-on-surface-variant text-base md:text-lg mb-1">
          {exp.company}
        </p>

        {/* <p className="font-label text-[10px] text-on-surface-variant/85 uppercase tracking-widest mb-5">
          {exp.period}
        </p> */}

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="font-label text-[11px] uppercase tracking-wider px-3 py-1 rounded-full ghost-border"
              style={{
                background: "rgba(229,196,151,0.05)",
                color: "rgba(209,197,183,0.85)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Role Evolution (expanded) ── */}
        <AnimatePresence>
          {isExpanded && exp.progression && exp.progression.length > 0 && (
            <motion.div
              key="progression"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-7 mt-7 border-t border-primary/10">
                <p className="font-label text-[11px] uppercase tracking-[0.3em] text-primary/50 mb-6">
                  Role Evolution
                </p>

                <div className="relative">
                  {/* Vertical connector line */}
                  {/* {exp.progression.length > 1 && (
                    <div className="absolute left-[7px] top-3 bottom-3 w-px bg-primary/10" />
                  )} */}

                  <div className="space-y-6">
                    {exp.progression.map((role, ri) => (
                      <motion.div
                        key={ri}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: ri * 0.08,
                          duration: 0.28,
                          ease: "easeOut",
                        }}
                        className="flex gap-5"
                      >
                        {/* Timeline dot */}
                        <div className="hidden md:flex flex-shrink-0 mt-1.5">
                          <div
                            className="w-3.5 h-3.5 rounded-full border-2 z-10 relative"
                            style={{
                              borderColor:
                                ri === 0 ? "#e5c497" : "rgba(78,69,59,0.6)",
                              background:
                                ri === 0
                                  ? "rgba(229,196,151,0.2)"
                                  : "transparent",
                              boxShadow:
                                ri === 0
                                  ? "0 0 10px rgba(229,196,151,0.3)"
                                  : "none",
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-2">
                            <h4 className="font-label text-sm font-semibold text-on-surface">
                              {role.title}
                            </h4>
                            <span className="font-label text-[11px] uppercase tracking-wider text-on-surface-variant/50">
                              {role.duration}
                            </span>
                          </div>

                          <ul className="space-y-1.5">
                            {role.points.map((point, pi) => (
                              <li
                                key={pi}
                                className="flex items-start gap-2.5"
                              >
                                <span className="text-primary/40 flex-shrink-0 font-bold leading-5 text-[11px] mt-px">
                                  &rsaquo;
                                </span>
                                <span className="font-body text-[12px] text-on-surface-variant/55 leading-relaxed">
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Key Contributions (expanded) ── */}
        {isExpanded && exp.details && exp.details.length > 0 && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: "easeOut", delay: 0.05 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-6 border-t border-primary/10">
              <p className="font-label text-[11px] uppercase tracking-[0.3em] text-primary/50 mb-5">
                Key Contributions
              </p>

              <ul className="space-y-2">
                {exp.details
                  // .slice(0, 3)
                  .map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.08,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="flex items-start gap-2.5"
                    >
                      <span className="text-primary/40 flex-shrink-0 font-bold leading-5 text-[11px] mt-px">
                        &rsaquo;
                      </span>
                      <span className="font-body text-[13px] text-on-surface-variant/70 leading-relaxed">
                        {point}
                      </span>
                    </motion.li>
                  ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
