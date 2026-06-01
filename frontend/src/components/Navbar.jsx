import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { studio } from "../mock";
import { X, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Studio", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-4 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5" : "py-6 bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-display text-white text-lg sm:text-xl font-extrabold tracking-tight leading-none">
              THE STUDIO <span className="text-[var(--sm-purple-soft)]">M</span>
            </span>
          </Link>

          <div className="hidden md:block text-[11px] tracking-[0.25em] uppercase text-white/50">
            {studio.location}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 text-white group"
            aria-label="Open menu"
          >
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/70 group-hover:text-white transition-colors hidden sm:inline">
              Menu
            </span>
            <span className="flex flex-col gap-[5px] items-end">
              <span className="block h-[1.5px] w-7 bg-white transition-all duration-300 group-hover:w-5" />
              <span className="block h-[1.5px] w-7 bg-white transition-all duration-300 group-hover:w-7" />
            </span>
          </button>
        </div>
      </header>

      {/* Overlay menu */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-700 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#0a0a0b] transition-opacity duration-700 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`relative h-full flex flex-col transition-all duration-700 ${
            open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 py-6 flex items-center justify-between">
            <span className="font-display text-white text-lg font-extrabold tracking-tight">
              THE STUDIO <span className="text-[var(--sm-purple-soft)]">M</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <span className="text-[11px] tracking-[0.25em] uppercase">Close</span>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 mx-auto w-full max-w-[1500px] px-5 sm:px-8 flex flex-col justify-center gap-2 sm:gap-3">
            {navItems.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-4 border-b border-white/10 py-4 sm:py-6"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="font-display text-[11vw] sm:text-[8vw] md:text-[6.5vw] leading-none font-bold text-white group-hover:text-[var(--sm-purple-soft)] transition-colors duration-300">
                  {item.label}
                </span>
                <ArrowUpRight
                  className="text-white/30 group-hover:text-[var(--sm-purple-soft)] transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-1"
                  size={40}
                />
              </Link>
            ))}
          </nav>

          <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 py-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-white/50">
            <a href={`tel:${studio.phoneRaw}`} className="sm-link hover:text-white transition-colors">
              {studio.phone}
            </a>
            <a href={`mailto:${studio.email}`} className="sm-link hover:text-white transition-colors">
              {studio.email}
            </a>
            <span>{studio.location}</span>
          </div>
        </div>
      </div>
    </>
  );
}
