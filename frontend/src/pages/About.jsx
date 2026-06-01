import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import useReveal from "../hooks/useReveal";
import { philosophy, stats, services, process } from "../mock";

export default function About() {
  useReveal();
  return (
    <main className="bg-[#0a0a0b] min-h-screen">
      <section className="pt-36 sm:pt-44 pb-16">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-6">
            The Studio
          </p>
          <h1 className="font-display text-[12vw] sm:text-[8vw] lg:text-[6vw] leading-[0.9] font-extrabold text-white tracking-tight">
            We craft brands that the world remembers.
          </h1>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <p className="reveal text-white/70 text-xl sm:text-2xl leading-relaxed font-light">
            {philosophy.body}
          </p>
          <p className="reveal text-white/50 text-lg leading-relaxed">{philosophy.body2}</p>
        </div>
      </section>

      <section className="py-16 bg-[var(--sm-cream)]">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="reveal">
              <p className="font-display text-[12vw] sm:text-6xl lg:text-7xl font-extrabold text-[#0a0a0b] leading-none">
                {s.value}
              </p>
              <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[#0a0a0b]/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          <h2 className="font-display text-[10vw] sm:text-[6vw] lg:text-[4.5vw] font-extrabold text-white tracking-tight mb-14 reveal">
            Our capabilities
          </h2>
          <div className="border-t border-white/10">
            {services.map((s) => (
              <div key={s.id} className="reveal grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-white/10 py-8">
                <span className="md:col-span-1 font-display text-sm text-[var(--sm-purple-soft)] font-bold">{s.no}</span>
                <h3 className="md:col-span-5 font-display text-2xl sm:text-3xl font-bold text-white">{s.title}</h3>
                <p className="md:col-span-6 text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          <h2 className="font-display text-[10vw] sm:text-[6vw] lg:text-[4.5vw] font-extrabold text-white tracking-tight mb-12 reveal">
            How we work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p) => (
              <div key={p.no} className="reveal rounded-xl border border-white/10 p-7 hover:border-[var(--sm-purple)]/50 hover:-translate-y-1 transition-all duration-300">
                <span className="font-display text-3xl font-extrabold text-[var(--sm-purple-soft)]">{p.no}</span>
                <h3 className="font-display text-xl font-bold text-white mt-6">{p.title}</h3>
                <p className="text-white/50 mt-3 leading-relaxed text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 reveal">
            <Link to="/contact" className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-white hover:bg-white hover:text-[#0a0a0b] transition-colors duration-300">
              <span className="text-xs tracking-[0.2em] uppercase">Work with us</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
