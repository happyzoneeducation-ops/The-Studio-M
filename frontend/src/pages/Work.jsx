import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import useReveal from "../hooks/useReveal";
import { services, projects as mockProjects } from "../mock";

const filters = ["All", ...services.map((s) => s.title)];

export default function Work() {
  const [active, setActive] = useState("All");
  const [projects] = useState(mockProjects);
  useReveal([active, projects]);

  const list =
    active === "All"
      ? projects
      : projects.filter((p) => Array.isArray(p.services) && p.services.includes(active));

  return (
    <main className="bg-[#0a0a0b] min-h-screen">
      <section className="pt-36 sm:pt-44 pb-12 sm:pb-16">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-6">
            Selected Work · 2023–2025
          </p>
          <h1 className="font-display text-[16vw] sm:text-[11vw] lg:text-[9vw] leading-[0.85] font-extrabold text-white tracking-tight">
            The Work
          </h1>
          <p className="max-w-xl text-white/55 text-lg mt-8">
            A selection of brands we've shaped across luxury, lifestyle and
            hospitality — strategy, identity, content, performance and product.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full border px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${
                  active === f
                    ? "bg-white text-[#0a0a0b] border-white"
                    : "border-white/20 text-white/60 hover:text-white hover:border-white/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {list.map((p, i) => (
            <Link
              key={p.id}
              to={`/work/${p.id}`}
              className={`reveal group relative block overflow-hidden rounded-xl bg-[#141416] ${
                p.size === "large" ? "md:col-span-2" : ""
              }`}
            >
              <div className={`overflow-hidden ${p.size === "large" ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">{p.year}</span>
                  <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View project <ArrowUpRight size={14} />
                  </span>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-2">
                    {p.category}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {p.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-center text-white/40 mt-16">No projects in this category yet.</p>
        )}
      </section>
    </main>
  );
}
