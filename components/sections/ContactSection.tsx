"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { toast } from "sonner";

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
    <section
      id="contact"
      className="py-24 md:py-32 overflow-hidden bg-surface-container-lowest"
    >
      <div
        id="contact-inner"
        className="px-8 md:px-12 max-w-[1920px] mx-auto"
      >
        <div className="mb-14">
          <span className="font-label text-primary uppercase tracking-[0.4em] text-xs">
            05 / let&apos;s talk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Left — info */}
          <div className="space-y-10 flex flex-col">
            <div className="space-y-6">
              <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-on-surface leading-[1.05]">
                Let’s build systems <br /> that{" "}
                <span className="text-primary">scale</span> reliably.
              </h2>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-lg leading-relaxed font-light">
                I design and build production-grade systems that handle
                real-world scale, performance, and reliability.
              </p>
              <ul className="list-disc list-inside text-on-surface-variant text-sm md:text-base space-y-1 max-w-md">
                <li>Open to full-time product engineering roles</li>
                <li>Experience building scalable systems across domains</li>
                <li>
                  Comfortable owning features end-to-end (frontend → backend →
                  deployment)
                </li>
              </ul>

              <p className="text-on-surface-variant text-sm md:text-base flex gap-4 items-center">
                Based in Pune <span>&#8226; Open to relocation / remote</span>
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 px-4 py-2 rounded-full bg-surface-container-high ghost-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                Open to Full-Time Roles
              </span>
            </div>
          </div>

          {/* Right — form */}
          <div className="glass-card p-8 md:p-12 rounded-xl ghost-border relative overflow-hidden">
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "rgba(200,169,126,0.05)",
                filter: "blur(80px)",
              }}
            />
            <form
              className="space-y-9 relative z-10"
              onSubmit={handleSubmit}
            >
              {[
                {
                  id: "name",
                  label: "Full Name",
                  type: "text",
                  placeholder: "John Doe",
                  key: "name" as const,
                },
                {
                  id: "email",
                  label: "Email Address",
                  type: "email",
                  placeholder: "john@example.com",
                  key: "email" as const,
                },
              ].map(({ id, label, type, placeholder, key }) => (
                <div
                  key={id}
                  className="space-y-1.5 border-b ghost-border pb-2 bg-background"
                >
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
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
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
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
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
