"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  { prefix: "$ ", text: "booting akshay.dev..." },
  { prefix: "> ", text: "frontend: React · Next.js · Vue.js" },
  {
    prefix: "> ",
    text: "backend: Node.js · Express · PostgreSQL · MongoDB",
  },
  { prefix: "> ", text: "cache: Redis" },
  { prefix: "> ", text: "cloud: AWS (S3 · SES · Lambda)" },
  { prefix: "> ", text: "auth: JWT · HTTP-only cookies · OTP" },
  { prefix: "> ", text: "status: building scalable production systems ✓" },
];

const TYPE_SPEED = 32; // ms per character
const LINE_PAUSE = 200; // ms pause between lines

export default function TerminalBlock() {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Start typing when the terminal scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!started || currentLine >= LINES.length) return;

    const fullText = LINES[currentLine].prefix + LINES[currentLine].text;

    if (currentChar < fullText.length) {
      const timer = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(timer);
    }

    // Line finished — commit it and move to the next after a pause
    const pause = setTimeout(() => {
      setDisplayed((prev) => [...prev, fullText]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, LINE_PAUSE);
    return () => clearTimeout(pause);
  }, [started, currentLine, currentChar]);

  const activeLine =
    currentLine < LINES.length
      ? (LINES[currentLine].prefix + LINES[currentLine].text).slice(
          0,
          currentChar,
        )
      : null;

  // Format line (adds hierarchy)
  const formatLine = (line: string) => {
    if (line.includes("status:")) {
      const [, value] = line.split("status:");
      return (
        <>
          <span className="text-[#8a8a8a]">{`>`} status:</span>
          <span className="text-[#e5c497]">{value}</span>
        </>
      );
    }

    const [label, value] = line.split(":");

    if (!value) {
      return <span className="text-[#c8c8c8]">{line}</span>;
    }

    return (
      <>
        <span className="text-[#8a8a8a]">{label}:</span>
        <span className="text-[#c8c8c8]">{value}</span>
      </>
    );
  };

  return (
    <div
      ref={ref}
      className="terminal-window rounded-xl overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-primary/65 font-label select-none">
          akshay.dev - bash
        </span>
      </div>

      {/* Terminal body */}
      <div className="px-5 py-5 font-mono text-sm leading-relaxed min-h-[260px] bg-[#0e0e0e]">
        {displayed.map((line, i) => (
          <div
            key={i}
            className="terminal-line"
          >
            {formatLine(line)}
          </div>
        ))}

        {activeLine !== null && (
          <div className="terminal-line">
            <span className="text-primary">{activeLine.slice(0, 2)}</span>
            <span className="text-[#c8c8c8]">{activeLine.slice(2)}</span>
            <span className="terminal-cursor" />
          </div>
        )}

        {currentLine >= LINES.length && (
          <div className="terminal-line">
            <span className="text-primary">{`>`}</span>{" "}
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
