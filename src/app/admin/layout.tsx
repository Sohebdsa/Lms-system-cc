"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, ChartBar, VideoCamera, SquaresFour, SignOut, List, X,
  ArrowSquareOut, ShieldCheck, Dot
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
    <div className="min-h-screen bg-[#fafafa] flex text-neutral-900 font-body">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-neutral-200/90 bg-white shadow-sm transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-18 border-b border-neutral-100">
          <div className="w-9 h-9 rounded-xl gradient-coral flex items-center justify-center shadow-md shadow-coral-500/20">
            <BookOpen size={18} weight="bold" className="text-white" />
          </div>
          <div>
            <p className="text-base font-extrabold font-display text-neutral-950 leading-none">BridgEd</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 mb-2">Management</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "btn-coral text-white shadow-md shadow-coral-500/20"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  <item.icon size={18} weight={active ? "fill" : "bold"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto px-4 pb-5 pt-3 border-t border-neutral-100 space-y-1.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowSquareOut size={16} />
              View Live Website
            </span>
            <span className="text-[10px] font-bold text-neutral-400">↗</span>
          </Link>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} weight="bold" className="text-coral-600" />
              <span className="text-xs font-bold text-neutral-900">Collective Consciousness</span>
            </div>
            <p className="text-[10px] text-neutral-500">Bangalore, IN · NGO Admin</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
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
        <header className="sticky top-0 z-30 h-18 flex items-center justify-between px-6 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <List size={20} />}
            </button>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Admin Portal</p>
              <h2 className="text-sm font-extrabold text-neutral-950 font-display">
                {pathname === "/admin/dashboard" ? "Platform Overview" : pathname === "/admin/videos" ? "Video Library Management" : "Analytics & Reports"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Production Active
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-extrabold flex items-center justify-center">
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
