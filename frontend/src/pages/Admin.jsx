import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Trash2, Check, Mail, Inbox, RefreshCw, ArrowUpRight } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  adminLogin,
  getAdminEnquiries,
  getAdminStats,
  markEnquiryRead,
  deleteEnquiry,
  getToken,
  clearToken,
} from "../api";

function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(username, password);
      toast.success("Welcome back.");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07060c] px-5">
      <div className="w-full max-w-sm">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--sm-purple-soft)] mb-3">THE STUDIO M</p>
        <h1 className="font-display text-4xl text-white font-semibold mb-8">Admin Login</h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-2">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="bg-white/5 border-white/15 text-white placeholder:text-white/30" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-2">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-white/5 border-white/15 text-white placeholder:text-white/30" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--sm-purple)] hover:bg-[var(--sm-purple-deep)] text-white px-6 py-3.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
            <ArrowUpRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2 text-white/50 mb-3">
        <Icon size={16} />
        <span className="text-[10px] tracking-[0.25em] uppercase">{label}</span>
      </div>
      <p className="font-display text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([getAdminEnquiries(), getAdminStats()]);
      setEnquiries(list);
      setStats(s);
    } catch (err) {
      if (err?.response?.status === 401) {
        clearToken();
        onLogout();
      } else {
        toast.error("Failed to load enquiries");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRead = async (id) => {
    try {
      await markEnquiryRead(id);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "read" } : e)));
      setStats((s) => ({ ...s, new: Math.max(0, s.new - 1), read: s.read + 1 }));
    } catch {
      toast.error("Could not update");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEnquiry(id);
      const removed = enquiries.find((e) => e.id === id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setStats((s) => ({
        total: Math.max(0, s.total - 1),
        new: removed?.status === "new" ? Math.max(0, s.new - 1) : s.new,
        read: removed?.status !== "new" ? Math.max(0, s.read - 1) : s.read,
      }));
      toast.success("Enquiry deleted");
    } catch {
      toast.error("Could not delete");
    }
  };

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-[#07060c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--sm-purple-soft)]">THE STUDIO M</p>
            <h1 className="font-display text-2xl font-semibold">Enquiries</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-white hover:border-white/40 transition-colors">
              <RefreshCw size={15} /> Refresh
            </button>
            <button onClick={() => { clearToken(); onLogout(); }} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-white hover:border-white/40 transition-colors">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 sm:px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={Inbox} label="Total" value={stats.total} />
          <StatCard icon={Mail} label="New" value={stats.new} />
          <StatCard icon={Check} label="Read" value={stats.read} />
        </div>

        {loading ? (
          <p className="text-white/40 text-sm tracking-[0.2em] uppercase animate-pulse py-16 text-center">Loading…</p>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <Inbox className="mx-auto text-white/30 mb-4" size={32} />
            <p className="text-white/50">No enquiries yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <div
                key={e.id}
                className={`rounded-xl border p-5 transition-colors ${
                  e.status === "new" ? "border-[var(--sm-purple)]/40 bg-[var(--sm-purple)]/5" : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-display text-xl font-semibold">{e.name}</h3>
                      {e.status === "new" && (
                        <span className="text-[9px] tracking-[0.2em] uppercase bg-[var(--sm-purple)] text-white px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-white/55">
                      <a href={`mailto:${e.email}`} className="hover:text-[var(--sm-purple-soft)] transition-colors">{e.email}</a>
                      {e.company ? <span>· {e.company}</span> : null}
                      {e.service ? <span>· {e.service}</span> : null}
                    </div>
                    <p className="mt-3 text-white/80 leading-relaxed max-w-2xl">{e.message}</p>
                    <p className="mt-3 text-[11px] tracking-wide text-white/35">{fmt(e.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {e.status === "new" && (
                      <button onClick={() => handleRead(e.id)} title="Mark as read" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-colors">
                        <Check size={16} />
                      </button>
                    )}
                    <a href={`mailto:${e.email}`} title="Reply by email" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-colors">
                      <Mail size={16} />
                    </a>
                    <button onClick={() => handleDelete(e.id)} title="Delete" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-red-400 hover:border-red-400/50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(!!getToken());

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }
  return <Dashboard onLogout={() => { setAuthed(false); navigate("/admin"); }} />;
}
