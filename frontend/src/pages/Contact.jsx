import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import useReveal from "../hooks/useReveal";
import { studio, services } from "../mock";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { createEnquiry } from "../api";

export default function Contact() {
  useReveal();
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and a short message.");
      return;
    }
    setSubmitting(true);
    try {
      await createEnquiry(form);
      setForm({ name: "", email: "", company: "", service: "", message: "" });
      toast.success("Thank you — we'll be in touch within 24 hours.");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#0a0a0b] min-h-screen">
      <section className="pt-36 sm:pt-44 pb-16">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--sm-purple-soft)] mb-6">
            Get in touch
          </p>
          <h1 className="font-display text-[13vw] sm:text-[9vw] lg:text-[7vw] leading-[0.88] font-extrabold text-white tracking-tight">
            Let's talk.
          </h1>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Whether you're launching, scaling or reimagining a brand — tell us
              what you're building and we'll show you how we can help.
            </p>
            <div className="space-y-6">
              <a href={`tel:${studio.phoneRaw}`} className="group block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Call</span>
                <p className="font-display text-2xl text-white group-hover:text-[var(--sm-purple-soft)] transition-colors">{studio.phone}</p>
              </a>
              <a href={`mailto:${studio.email}`} className="group block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Mail</span>
                <p className="font-display text-2xl text-white group-hover:text-[var(--sm-purple-soft)] transition-colors break-all">{studio.email}</p>
              </a>
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Studio</span>
                <p className="font-display text-2xl text-white">{studio.location}</p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">Name *</label>
                <Input value={form.name} onChange={update("name")} placeholder="Your name" className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white text-lg focus-visible:ring-0 focus-visible:border-[var(--sm-purple-soft)] placeholder:text-white/30" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">Email *</label>
                <Input type="email" value={form.email} onChange={update("email")} placeholder="you@brand.com" className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white text-lg focus-visible:ring-0 focus-visible:border-[var(--sm-purple-soft)] placeholder:text-white/30" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">Company</label>
                <Input value={form.company} onChange={update("company")} placeholder="Brand / Company" className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white text-lg focus-visible:ring-0 focus-visible:border-[var(--sm-purple-soft)] placeholder:text-white/30" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">Service</label>
                <select value={form.service} onChange={update("service")} className="w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 text-white text-lg focus:outline-none focus:border-[var(--sm-purple-soft)]">
                  <option value="" className="bg-[#0a0a0b]">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title} className="bg-[#0a0a0b]">{s.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">Message *</label>
              <Textarea value={form.message} onChange={update("message")} placeholder="Tell us about your project…" rows={4} className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-white text-lg focus-visible:ring-0 focus-visible:border-[var(--sm-purple-soft)] placeholder:text-white/30 resize-none" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex items-center gap-3 rounded-full bg-white text-[#0a0a0b] px-8 py-4 hover:bg-[var(--sm-purple)] hover:text-white transition-colors duration-300 disabled:opacity-60"
            >
              <span className="text-xs tracking-[0.2em] uppercase font-medium">{submitting ? "Sending…" : "Send enquiry"}</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
