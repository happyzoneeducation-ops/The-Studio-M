import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import useReveal from "../hooks/useReveal";
import { studio, heroLines, projects, services, philosophy, stats, clients, process } from "../mock";

function Hero() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#0a0a0b] sm-grain">
      <div className="absolute -top-40 -right-40 w-[55vw] h-[55vw] rounded-full bg-[var(--sm-purple-deep)]/20 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[40vw] h-[40vw] rounded-full bg-[var(--sm-purple)]/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 pb-10 pt-36">
        <p className="overflow-hidden mb-6">
          <span className="sm-rise inline-block text-[11px] sm:text-sm tracking-[0.35em] uppercase text-[var(--sm-purple-soft)]">
            A Marketing Studio · Working Globally
          </span>
        </p>

        <h1 className="font-display font-extrabold text-white leading-[0.86] tracking-tight">
          {heroLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className="sm-rise inline-block text-[14vw] sm:text-[12vw] lg:text-[10.5vw]"
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              >
                {line === "& hospitality." ? (
                  <>
                    <span className="text-[var(--sm-purple-soft)]">&</span> hospitality.
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <p className="max-w-md text-white/60 text-base sm:text-lg leading-relaxed">
            Ideas can come from anywhere. We turn them into brands the world
            remembers — for luxury, lifestyle and hospitality.
          </p>
          <div className="flex items-center gap-8">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">New Delhi</p>
              <p className="font-display text-white text-lg font-semibold tabular-nums">{time} IST</p>
            </div>
            <Link
              to="/work"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-4 hover:bg-white hover:text-[#0a0a0b] transition-colors duration-300"
            >
              <span className="text-xs tracking-[0.2em] uppercase">View work</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3 text-white/40">
          <ArrowDown size={16} className="animate-bounce" />
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to view more</span>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...clients, ...clients];
  return (
    <div className="bg-[var(--sm-cream)] py-6 overflow-hidden border-y border-black/5">
      <div className="sm-marquee-track">
        {items.map((c, i) => (
          <span key={i} className="inline-flex items-center gap-10 mx-10">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0a0a0b]/80">{c}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--sm-purple)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <Link
      to={`/work/${project.id}`}
      className={`reveal group relative block overflow-hidden rounded-xl bg-[#141416] ${
        project.size === "large" ? "md:col-span-2" : ""
      }`}
    >
      <div className={`overflow-hidden ${project.size === "large" ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <img
          src={project.cover}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">{`0${index + 1}`}</span>
          <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View project <ArrowUpRight size={14} />
          </span>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-2">
            {project.category}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function SelectedWork() {
  return (
    <section className="bg-[#0a0a0b] py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex items-end justify-between mb-12 reveal">
          <h2 className="font-display text-[13vw] sm:text-[8vw] lg:text-[6vw] leading-[0.9] font-extrabold text-white tracking-tight">
            Selected <br /> <span className="text-white/30">Work</span>
          </h2>
          <Link to="/work" className="hidden sm:inline-flex items-center gap-2 text-white/60 hover:text-white sm-link transition-colors">
            <span className="text-xs tracking-[0.2em] uppercase">All projects</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.slice(0, 5).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/work"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-white hover:bg-white hover:text-[#0a0a0b] transition-colors duration-300"
          >
            <span className="text-xs tracking-[0.2em] uppercase">View all work</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="bg-[var(--sm-cream)] py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 mb-14 reveal">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--sm-purple-deep)] lg:w-48 shrink-0 lg:pt-3">
            What we do
          </p>
          <h2 className="font-display text-[8vw] sm:text-[5.5vw] lg:text-[4vw] leading-[0.95] font-extrabold text-[#0a0a0b] tracking-tight">
            Full-service marketing, crafted for brands that refuse to blend in.
          </h2>
        </div>

        <div className="border-t border-black/10">
          {services.map((s) => (
            <div
              key={s.id}
              className="reveal group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start border-b border-black/10 py-8 sm:py-10 hover:bg-black/[0.02] transition-colors px-2"
            >
              <span className="md:col-span-1 font-display text-sm text-[var(--sm-purple-deep)] font-bold">{s.no}</span>
              <h3 className="md:col-span-5 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a0a0b] group-hover:translate-x-2 transition-transform duration-300">
                {s.title}
              </h3>
              <p className="md:col-span-5 text-[#0a0a0b]/60 leading-relaxed">{s.desc}</p>
              <ArrowUpRight className="md:col-span-1 justify-self-end text-[#0a0a0b]/30 group-hover:text-[var(--sm-purple-deep)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="relative bg-[#0a0a0b] py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[var(--sm-purple-deep)]/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-10 reveal">
          Brands — Think, Feel, Look, Talk
        </p>
        <div className="reveal">
          <h2 className="font-display font-extrabold text-white leading-[0.9] tracking-tight text-[15vw] sm:text-[11vw] lg:text-[8.5vw]">
            {philosophy.heading.map((w, i) => (
              <span key={i} className={i % 2 === 1 ? "text-white/25" : ""}>
                {w}{" "}
              </span>
            ))}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 reveal">
          <p className="text-white/70 text-lg sm:text-xl leading-relaxed">{philosophy.body}</p>
          <p className="text-white/50 text-base sm:text-lg leading-relaxed">{philosophy.body2}</p>
        </div>
        <div className="mt-12 reveal">
          <Link
            to="/about"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-white hover:bg-white hover:text-[#0a0a0b] transition-colors duration-300"
          >
            <span className="text-xs tracking-[0.2em] uppercase">Read more</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-[var(--sm-cream)] py-16 sm:py-20">
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
  );
}

function Process() {
  return (
    <section className="bg-[#0a0a0b] py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <h2 className="font-display text-[10vw] sm:text-[6vw] lg:text-[4.5vw] font-extrabold text-white tracking-tight mb-14 reveal">
          How we work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((p) => (
            <div
              key={p.no}
              className="reveal group rounded-xl border border-white/10 p-7 hover:border-[var(--sm-purple)]/50 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="font-display text-3xl font-extrabold text-[var(--sm-purple-soft)]">{p.no}</span>
              <h3 className="font-display text-xl font-bold text-white mt-6">{p.title}</h3>
              <p className="text-white/50 mt-3 leading-relaxed text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useReveal();
  return (
    <main>
      <Hero />
      <Marquee />
      <SelectedWork />
      <Services />
      <Philosophy />
      <Stats />
      <Process />
    </main>
  );
}
