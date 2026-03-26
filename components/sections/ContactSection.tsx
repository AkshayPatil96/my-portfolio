"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to("#contact-inner", {
        scrollTrigger: {
          trigger: "#contact",
          start: "top 78%",
          toggleActions: "play none none none",
        },
        clipPath: "inset(0% 0 0 0)",
        duration: 1.2,
        ease: "power4.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission placeholder
  };

  return (
    <section id="contact" className="py-24 md:py-32 overflow-hidden bg-surface-container-lowest">
      <div id="contact-inner" className="px-8 md:px-12 max-w-[1920px] mx-auto">
        <div className="mb-14">
          <span className="font-label text-primary uppercase tracking-[0.4em] text-xs">
            05 / let&apos;s talk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Left — info */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-on-surface leading-[1.05]">
                Let&apos;s build<br />
                something <em className="text-primary">great.</em>
              </h2>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-lg leading-relaxed font-light">
                Open to full-time roles at product-based companies. Currently
                based in Nashik, relocating to Pune mid-2026.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-high ghost-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                Currently available for roles
              </span>
            </div>

            <div className="space-y-7 pt-2">
              {[
                { icon: "mail", label: "Email", value: "hello@akshay.dev" },
                { icon: "share", label: "LinkedIn", value: "in/akshaysharma-dev" },
                { icon: "code", label: "GitHub", value: "github.com/akshay-dev" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-5 group cursor-pointer">
                  <div
                    className="rounded-full bg-surface-container-low ghost-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shrink-0"
                    style={{ width: 52, height: 52 }}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50">
                      {label}
                    </p>
                    <p className="text-on-surface font-label text-base md:text-lg">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="glass-card p-8 md:p-12 rounded-xl ghost-border relative overflow-hidden">
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "rgba(200,169,126,0.05)", filter: "blur(80px)" }}
            />
            <form className="space-y-9 relative z-10" onSubmit={handleSubmit}>
              {[
                { id: "name", label: "Full Name", type: "text", placeholder: "John Doe", key: "name" as const },
                { id: "email", label: "Email Address", type: "email", placeholder: "john@example.com", key: "email" as const },
              ].map(({ id, label, type, placeholder, key }) => (
                <div key={id} className="space-y-1.5 border-b ghost-border pb-2 bg-background">
                  <label
                    htmlFor={id}
                    className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 block pt-2 pl-2"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-transparent border-none p-0 pl-2 focus:ring-0 text-on-surface text-lg placeholder:text-on-surface-variant/20 outline-none"
                  />
                </div>
              ))}

              <div className="space-y-1.5 border-b ghost-border bg-background">
                <label
                  htmlFor="message"
                  className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 block pt-2 pl-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Briefly describe your project..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full bg-transparent border-none p-0 pl-2 focus:ring-0 text-on-surface text-lg placeholder:text-on-surface-variant/20 resize-none outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="mag-btn w-full bg-primary text-on-primary py-5 rounded-full font-label uppercase tracking-[0.2em] text-sm font-bold flex items-center justify-center gap-3 group"
                >
                  Send Message
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform duration-300">
                    arrow_right_alt
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
