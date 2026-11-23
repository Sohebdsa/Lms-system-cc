"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, EnvelopeSimple, Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import Link from "next/link";
import { motion } from "motion/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@bridged.in");
  const [password, setPassword] = useState("bridged2026");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (email === "admin@bridged.in" && password === "bridged2026") {
      localStorage.setItem("bridged_admin_token", "mock_jwt_token_2026");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please use admin@bridged.in / bridged2026");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative font-body" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg gradient-coral">
            <BookOpen size={24} weight="bold" className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-extrabold" style={{ color: "var(--text)" }}>BridgEd Admin</h1>
          <p className="text-xs mt-1 font-medium" style={{ color: "var(--muted)" }}>Collective Consciousness LMS Console</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border p-7 shadow-lg" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text)" }}>
                Admin Email
              </label>
              <div className="relative">
                <EnvelopeSimple size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bridged.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm shadow-2xs transition-colors"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text)" }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm shadow-2xs transition-colors"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--muted)" }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs px-3.5 py-2.5 rounded-xl font-medium border"
                style={{ color: "var(--primary)", backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", borderColor: "color-mix(in srgb, var(--primary) 20%, transparent)" }}>
                {error}
              </p>
            )}

            <div className="p-3 rounded-xl border text-[11px] flex items-center justify-between"
              style={{ backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)", borderColor: "var(--border)", color: "var(--muted)" }}>
              <span>Demo credentials pre-filled</span>
              <span className="font-bold" style={{ color: "var(--success)" }}>Ready</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-coral text-sm font-bold text-white shadow-md active:scale-95 disabled:opacity-60 transition-all"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin"}</span>
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs font-semibold transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
            ← Back to Public Website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
