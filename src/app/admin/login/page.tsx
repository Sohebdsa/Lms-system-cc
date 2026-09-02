"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, EnvelopeSimple, Lock, Eye, EyeSlash, ShieldCheck } from "@phosphor-icons/react";
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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 relative text-neutral-900 font-body">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-coral mb-4 shadow-lg shadow-coral-500/25">
            <BookOpen size={24} weight="bold" className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-950">BridgEd Admin</h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Collective Consciousness LMS Console</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-7 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <EnvelopeSimple size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bridged.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-coral-500 shadow-2xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-coral-500 shadow-2xs transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-xl font-medium">
                {error}
              </p>
            )}

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Demo credentials pre-filled</span>
              <span className="font-bold text-coral-600">Ready</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-coral text-sm font-bold text-white shadow-md shadow-coral-500/25 active:scale-95 disabled:opacity-60 transition-all"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin"}</span>
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors">
            ← Back to Public Website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
