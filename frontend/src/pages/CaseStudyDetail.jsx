import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import useReveal from "../hooks/useReveal";
import { getProjects } from "../api";

export default function CaseStudyDetail() {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useReveal([id, projects]);

  useEffect(() => {
    let on = true;
    getProjects()
      .then((d) => on && setProjects(d))
      .catch(() => on && setProjects([]))
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, []);

  const idx = projects.findIndex((p) => p.id === id);
  const project = projects[idx];

  if (loading) {
    return (
      <main className="bg-[#0a0a0b] min-h-screen flex items-center justify-center">
        <span className="text-white/40 text-sm tracking-[0.3em] uppercase animate-pulse">Loading…</span>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="bg-[#0a0a0b] min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-4xl text-white mb-4">Project not found</h1>
          <Link to="/work" className="text-[var(--sm-purple-soft)] sm-link">Back to work</Link>
        </div>
      </main>
    );
  }

  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="bg-[#0a0a0b] min-h-screen">
      <section className="pt-32 sm:pt-40 pb-10">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          <Link to="/work" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-10 text-xs tracking-[0.2em] uppercase">
            <ArrowLeft size={16} /> All work
          </Link>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-5">
            {project.category} · {project.year}
          </p>
          <h1 className="font-display text-[15vw] sm:text-[10vw] lg:text-[8vw] leading-[0.85] font-extrabold text-white tracking-tight">
            {project.title}
          </h1>
          <p className="max-w-2xl text-white/60 text-xl sm:text-2xl mt-8 leading-snug font-light">
            {project.summary}
          </p>
        </div>
      </section>

      <section className="pb-6">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-2xl aspect-[16/9]">
            <img src={project.cover} alt={project.title} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-4">Services</p>
            <ul className="space-y-2">
              {project.services.map((s) => (
                <li key={s} className="font-display text-lg text-white border-b border-white/10 pb-2">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-4">The work</p>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-white leading-snug font-semibold">
              {project.scope}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-white/10 py-12">
          {project.results.map((r) => (
            <div key={r.label} className="reveal">
              <p className="font-display text-5xl sm:text-6xl font-extrabold text-[var(--sm-purple-soft)] leading-none">
                {r.value}
              </p>
              <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-white/50">{r.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 flex flex-col gap-6">
          {project.gallery.map((g, i) => (
            <div key={i} className="reveal overflow-hidden rounded-2xl">
              <img src={g} alt={`${project.title} ${i + 1}`} loading="lazy" className="w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <Link to={`/work/${next.id}`} className="group block py-16 sm:py-24">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-3">Next project</p>
              <h2 className="font-display text-[10vw] sm:text-[6vw] font-extrabold text-white group-hover:text-[var(--sm-purple-soft)] transition-colors">
                {next.title}
              </h2>
            </div>
            <ArrowUpRight size={56} className="text-white/30 group-hover:text-[var(--sm-purple-soft)] group-hover:translate-x-2 group-hover:-translate-y-2 transition-all shrink-0" />
          </div>
        </Link>
      </section>
    </main>
  );
}
