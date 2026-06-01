import React from "react";
import { Link } from "react-router-dom";
import { studio } from "../mock";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const contacts = [
    { label: "Call", value: studio.phone, href: `tel:${studio.phoneRaw}` },
    { label: "Mail", value: studio.email, href: `mailto:${studio.email}` },
    { label: "Follow", value: "Instagram", href: studio.instagram },
    { label: "Location", value: "New Delhi", href: "https://maps.google.com" },
  ];

  return (
    <footer className="relative bg-[#0a0a0b] text-white border-t border-white/10">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 pt-20 sm:pt-28 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-6">
              Get in touch
            </p>
            <h2 className="font-display text-[12vw] sm:text-[8vw] lg:text-[6.5vw] leading-[0.92] font-extrabold tracking-tight">
              Let's build <br />
              something <span className="text-[var(--sm-purple-soft)]">extraordinary.</span>
            </h2>
          </div>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 self-start rounded-full border border-white/20 px-7 py-4 hover:bg-white hover:text-[#0a0a0b] transition-colors duration-300"
          >
            <span className="text-sm tracking-[0.2em] uppercase">Start a project</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 sm:mt-24 border-t border-white/10 pt-10">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex flex-col gap-2"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">{c.label}</span>
              <span className="font-display text-lg sm:text-xl font-semibold group-hover:text-[var(--sm-purple-soft)] transition-colors">
                {c.value}
              </span>
            </a>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-16 text-xs text-white/40">
          <span className="font-display text-white/70 text-sm font-bold tracking-tight">
            THE STUDIO <span className="text-[var(--sm-purple-soft)]">M</span>
          </span>
          <span>© {studio.year} THE STUDIO M. All rights reserved.</span>
          <span className="tracking-[0.2em] uppercase">Marketing · Luxury · Hospitality</span>
        </div>
      </div>
    </footer>
  );
}
