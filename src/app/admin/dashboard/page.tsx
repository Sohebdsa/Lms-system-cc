"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye, GameController, Clock, TrendUp, VideoCamera, ArrowUpRight,
  Plus, CheckCircle, DownloadSimple,
} from "@phosphor-icons/react";
import { ANALYTICS, formatViews, formatDuration } from "@/lib/data";
import { useVideos } from "@/lib/video-store";

// Aangan subject bar colors using palette
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#C4452E",   // Sindoor
  Science: "#E2A93B",       // Haldi
  "Language Arts": "#7E9A6E", // Neem
  Other: "#2F4A73",         // Indigo
};

export default function AdminDashboard() {
  const { videos } = useVideos();
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);

  const STAT_CARDS = [
    { label: "Total Video Views", value: formatViews(totalViews || ANALYTICS.totalVideoViews), icon: Eye, change: "+14.2%", trend: "up", sub: "vs previous week" },
    { label: "Total Game Plays", value: formatViews(ANALYTICS.totalGamePlays), icon: GameController, change: "+9.8%", trend: "up", sub: "across 5 games" },
    { label: "Avg Watch Duration", value: formatDuration(ANALYTICS.avgWatchDuration), icon: Clock, change: "+4.1%", trend: "up", sub: "72% completion rate" },
    { label: "Live Published Lessons", value: videos.length.toString(), icon: VideoCamera, change: "Active", trend: "neutral", sub: "3 Indian languages" },
  ];

  const SUBJECT_STATS = [
    { name: "Mathematics", count: videos.filter((v) => v.subject === "Mathematics").length || 4, pct: 35 },
    { name: "Science", count: videos.filter((v) => v.subject === "Science").length || 3, pct: 28 },
    { name: "Language Arts", count: videos.filter((v) => v.subject === "Language Arts").length || 3, pct: 25 },
    { name: "Environmental & Social", count: videos.filter((v) => v.subject.includes("Social") || v.subject.includes("Environmental")).length || 2, pct: 12 },
  ];

  const cardStyle = { backgroundColor: "var(--surface)", borderColor: "var(--border)" };

  return (
    <div className="space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display" style={{ color: "var(--text)" }}>Platform Overview</h1>
          <p className="text-xs mt-1 font-medium" style={{ color: "var(--muted)" }}>Collective Consciousness LMS · Real-time operational analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/videos" className="btn-coral inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all">
            <Plus size={16} weight="bold" />
            Upload Video
          </Link>
          <Link href="/admin/analytics" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors shadow-xs"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}>
            <DownloadSimple size={16} weight="bold" />
            Full Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all duration-200"
            style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
                style={{ backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }}>
                <card.icon size={20} weight="bold" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold border px-2 py-0.5 rounded-lg"
                style={{ color: "#3A6A30", backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)", borderColor: "color-mix(in srgb, var(--success) 25%, transparent)" }}>
                <TrendUp size={12} weight="bold" />
                {card.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold font-display tracking-tight" style={{ color: "var(--text)" }}>{card.value}</p>
            <p className="text-xs font-bold mt-1" style={{ color: "var(--muted)" }}>{card.label}</p>
            <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--muted)" }}>{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Share */}
        <div className="rounded-3xl border p-6 shadow-xs lg:col-span-1 flex flex-col justify-between" style={cardStyle}>
          <div>
            <h2 className="text-base font-bold font-display mb-1" style={{ color: "var(--text)" }}>Curriculum Distribution</h2>
            <p className="text-xs mb-6 font-medium" style={{ color: "var(--muted)" }}>Published lessons by academic subject</p>

            <div className="space-y-4">
              {SUBJECT_STATS.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span style={{ color: "var(--text)" }}>{item.name}</span>
                    <span className="font-mono" style={{ color: "var(--text)" }}>{item.count} videos</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: SUBJECT_COLORS[item.name] || SUBJECT_COLORS.Other }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--border)" }}>
            <span style={{ color: "var(--muted)" }}>Multilingual parity</span>
            <span className="font-bold flex items-center gap-1" style={{ color: "var(--success)" }}>
              <CheckCircle size={14} weight="fill" />
              Equal Allocation
            </span>
          </div>
        </div>

        {/* Top Watched Content */}
        <div className="rounded-3xl border p-6 shadow-xs lg:col-span-2" style={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold font-display" style={{ color: "var(--text)" }}>Top Performing Educational Videos</h2>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--muted)" }}>Most active student streams</p>
            </div>
            <Link href="/admin/videos" className="text-xs font-bold flex items-center gap-1 transition-colors"
              style={{ color: "var(--primary)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--secondary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--primary)")}>
              Manage Catalog <ArrowUpRight size={13} weight="bold" />
            </Link>
          </div>

          <div className="space-y-3">
            {videos.slice(0, 5).sort((a, b) => b.views - a.views).map((v, i) => (
              <div key={v.id} className="flex items-center gap-3.5 p-2.5 rounded-2xl transition-colors border border-transparent"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--border) 40%, transparent)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                <span className="text-xs font-mono font-bold w-4 text-center" style={{ color: "var(--muted)" }}>{i + 1}</span>
                <div className="relative w-14 h-9 rounded-xl overflow-hidden shrink-0 border" style={{ backgroundColor: "var(--border)", borderColor: "var(--border)" }}>
                  <Image src={v.thumbnailUrl} alt={v.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>{v.title}</p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>{v.subject} · {v.grade}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold tabular-nums" style={{ color: "var(--text)" }}>{formatViews(v.views)}</p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="rounded-3xl border p-6 shadow-xs" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold font-display" style={{ color: "var(--text)" }}>Live Student Activity Feed</h2>
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Recent video plays and game sessions</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold border px-3 py-1 rounded-full"
            style={{ color: "#3A6A30", backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)", borderColor: "color-mix(in srgb, var(--success) 25%, transparent)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--success)" }} />
            Streaming Live
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {ANALYTICS.recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={item.type === "video_view"
                    ? { backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }
                    : { backgroundColor: "color-mix(in srgb, var(--teal) 10%, transparent)", color: "var(--teal)" }}>
                  {item.type === "video_view" ? <Eye size={15} weight="bold" /> : <GameController size={15} weight="bold" />}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{item.itemTitle}</p>
                  <p className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
                    {item.type === "video_view" ? "Video Lesson" : "Interactive Game"} · Language: {item.language.toUpperCase()}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono" style={{ color: "var(--muted)" }}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
