import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { studio } from "../mock";
import { X, ArrowUpRight, Menu } from "lucide-react";

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

  const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <>
      <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4">
        <div
          className={`mx-auto flex items-center gap-2 sm:gap-3 rounded-full sm-glass transition-all duration-500 ${
            scrolled ? "py-1.5 pl-4 pr-1.5" : "py-2 pl-5 pr-2"
          } w-full max-w-[920px]`}
        >
          {/* Logo */}
          <Link to="/" className="font-display text-white text-base sm:text-lg font-semibold tracking-tight leading-none mr-auto">
            THE STUDIO <span className="font-italic-serif text-[var(--sm-purple-soft)]">M</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                  isActive(item.to)
                    ? "text-white bg-white/10"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Book a call (desktop) */}
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[var(--sm-purple)] hover:bg-[var(--sm-purple-deep)] text-white px-5 py-2.5 text-sm font-medium transition-colors duration-300"
          >
            Book a call
            <ArrowUpRight size={15} />
          </Link>

          {/* Mobile trigger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Overlay menu (mobile) */}
      <div className={`fixed inset-0 z-[60] transition-all duration-700 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-[#07060c]/95 backdrop-blur-xl transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`} />
        <div className={`relative h-full flex flex-col transition-all duration-700 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
          <div className="flex items-center justify-between px-5 py-6">
            <span className="font-display text-white text-lg font-semibold tracking-tight">
              THE STUDIO <span className="font-italic-serif text-[var(--sm-purple-soft)]">M</span>
            </span>
            <button onClick={() => setOpen(false)} className="flex items-center gap-2 text-white/70 hover:text-white" aria-label="Close menu">
              <span className="text-[11px] tracking-[0.25em] uppercase">Close</span>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-5 flex flex-col justify-center gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="group flex items-center justify-between border-b border-white/10 py-5">
                <span className="font-display text-[13vw] leading-none font-semibold text-white group-hover:text-[var(--sm-purple-soft)] transition-colors duration-300">
                  {item.label}
                </span>
                <ArrowUpRight className="text-white/30 group-hover:text-[var(--sm-purple-soft)] transition-all duration-300" size={32} />
              </Link>
            ))}
          </nav>

          <div className="px-5 py-8 flex flex-col gap-3 text-sm text-white/55">
            <a href={`tel:${studio.phoneRaw}`} className="sm-link hover:text-white transition-colors">{studio.phone}</a>
            <a href={`mailto:${studio.email}`} className="sm-link hover:text-white transition-colors">{studio.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
