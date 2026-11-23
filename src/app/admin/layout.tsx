"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChartBar, VideoCamera, SquaresFour, SignOut, List, X,
  ArrowSquareOut, ShieldCheck,
} from "@phosphor-icons/react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const token = localStorage.getItem("bridged_admin_token");
    if (!token) router.push("/admin/login");
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem("bridged_admin_token");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  const NAV_ITEMS = [
    { href: "/admin/dashboard", icon: SquaresFour, label: "Overview" },
    { href: "/admin/videos", icon: VideoCamera, label: "Video Management" },
    { href: "/admin/analytics", icon: ChartBar, label: "Analytics & Reports" },
  ];

  return (
    <div className="min-h-screen flex font-body" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r shadow-sm transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-18 border-b" style={{ borderColor: "var(--border)" }}>
          <Image
            src="/CCLOGOONLY.png"
            alt="Collective Consciousness Logo"
            width={99}
            height={36}
            className="object-contain shrink-0"
          />
          <div>
            <p className="text-sm font-extrabold font-display leading-none" style={{ color: "var(--text)" }}>Collective Consciousness</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--success)" }} />
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: "var(--muted)" }}>Management</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    active ? "btn-coral text-white shadow-md" : ""
                  }`}
                  style={!active ? { color: "var(--muted)" } : {}}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--border) 60%, transparent)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = ""; }}
                >
                  <item.icon size={18} weight={active ? "fill" : "bold"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto px-4 pb-5 pt-3 border-t space-y-1.5" style={{ borderColor: "var(--border)" }}>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--border) 50%, transparent)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.backgroundColor = ""; }}
          >
            <span className="flex items-center gap-2">
              <ArrowSquareOut size={16} />
              View Live Website
            </span>
            <span className="text-[10px] font-bold" style={{ color: "var(--muted)" }}>↗</span>
          </Link>

          <div className="p-3 rounded-xl border mb-2" style={{ backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} weight="bold" style={{ color: "var(--primary)" }} />
              <span className="text-xs font-bold" style={{ color: "var(--text)" }}>Collective Consciousness</span>
            </div>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>Bangalore, IN · NGO Admin</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-transparent transition-colors"
            style={{ color: "#C4452E" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 8%, transparent)"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 20%, transparent)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <SignOut size={16} weight="bold" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-18 flex items-center justify-between px-6 border-b backdrop-blur-md"
          style={{ backgroundColor: "color-mix(in srgb, var(--surface) 95%, transparent)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors"
              style={{ color: "var(--muted)" }}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <List size={20} />}
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Admin Portal</p>
              <h2 className="text-sm font-extrabold font-display" style={{ color: "var(--text)" }}>
                {pathname === "/admin/dashboard" ? "Platform Overview" : pathname === "/admin/videos" ? "Video Library Management" : "Analytics & Reports"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
              style={{ backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)", borderColor: "color-mix(in srgb, var(--success) 25%, transparent)", color: "var(--success)" }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
              Production Active
            </div>
            <div className="w-8 h-8 rounded-full text-white text-xs font-extrabold flex items-center justify-center" style={{ backgroundColor: "var(--secondary)" }}>
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
