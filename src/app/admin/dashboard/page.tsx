"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye, GameController, Clock, TrendUp, VideoCamera, ArrowUpRight,
  Plus, Globe, CheckCircle, DownloadSimple, ShieldCheck, Sparkle
} from "@phosphor-icons/react";
import { ANALYTICS, formatViews, formatDuration } from "@/lib/data";
import { useVideos } from "@/lib/video-store";

export default function AdminDashboard() {
  const { videos } = useVideos();
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);

  const STAT_CARDS = [
    {
      label: "Total Video Views",
      value: formatViews(totalViews || ANALYTICS.totalVideoViews),
      icon: Eye,
      change: "+14.2%",
      trend: "up",
      sub: "vs previous week",
    },
    {
      label: "Total Game Plays",
      value: formatViews(ANALYTICS.totalGamePlays),
      icon: GameController,
      change: "+9.8%",
      trend: "up",
      sub: "across 5 games",
    },
    {
      label: "Avg Watch Duration",
      value: formatDuration(ANALYTICS.avgWatchDuration),
      icon: Clock,
      change: "+4.1%",
      trend: "up",
      sub: "72% completion rate",
    },
    {
      label: "Live Published Lessons",
      value: videos.length.toString(),
      icon: VideoCamera,
      change: "Active",
      trend: "neutral",
      sub: "3 Indian languages",
    },
  ];

  // Subject distribution
  const SUBJECT_STATS = [
    { name: "Mathematics", count: videos.filter((v) => v.subject === "Mathematics").length || 4, color: "bg-coral-500", pct: 35 },
    { name: "Science", count: videos.filter((v) => v.subject === "Science").length || 3, color: "bg-amber-500", pct: 28 },
    { name: "Language Arts", count: videos.filter((v) => v.subject === "Language Arts").length || 3, color: "bg-emerald-500", pct: 25 },
    { name: "Environmental & Social", count: videos.filter((v) => v.subject.includes("Social") || v.subject.includes("Environmental")).length || 2, color: "bg-indigo-500", pct: 12 },
  ];

  return (
    <div className="space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-neutral-950">
            Platform Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Collective Consciousness LMS · Real-time operational analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/videos"
            className="btn-coral inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-coral-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} weight="bold" />
            Upload Video
          </Link>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700 shadow-xs transition-colors"
          >
            <DownloadSimple size={16} weight="bold" />
            Full Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-3xl border border-neutral-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center shadow-xs">
                <card.icon size={20} weight="bold" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                <TrendUp size={12} weight="bold" />
                {card.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold font-display text-neutral-950 tracking-tight">
              {card.value}
            </p>
            <p className="text-xs font-bold text-neutral-500 mt-1">{card.label}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-medium">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Middle Grid: Subject Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Share */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs lg:col-span-1 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold font-display text-neutral-950 mb-1">
              Curriculum Distribution
            </h2>
            <p className="text-xs text-neutral-500 mb-6 font-medium">Published lessons by academic subject</p>

            <div className="space-y-4">
              {SUBJECT_STATS.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-neutral-700">{item.name}</span>
                    <span className="text-neutral-900 font-mono">{item.count} videos</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Multilingual parity</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle size={14} weight="fill" />
              Equal Allocation
            </span>
          </div>
        </div>

        {/* Top Watched Content */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold font-display text-neutral-950">
                Top Performing Educational Videos
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">Most active student streams</p>
            </div>
            <Link
              href="/admin/videos"
              className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1"
            >
              Manage Catalog <ArrowUpRight size={13} weight="bold" />
            </Link>
          </div>

          <div className="space-y-3">
            {videos.slice(0, 5).sort((a, b) => b.views - a.views).map((v, i) => (
              <div
                key={v.id}
                className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-neutral-50/80 transition-colors border border-transparent hover:border-neutral-200/80"
              >
                <span className="text-xs font-mono font-bold text-neutral-400 w-4 text-center">{i + 1}</span>
                <div className="relative w-14 h-9 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                  <Image src={v.thumbnailUrl} alt={v.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-900 truncate">{v.title}</p>
                  <p className="text-[10px] text-neutral-500">{v.subject} · {v.grade}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-neutral-900 tabular-nums">{formatViews(v.views)}</p>
                  <p className="text-[10px] text-neutral-400">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Feed */}
      <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold font-display text-neutral-950">
              Live Student Activity Feed
            </h2>
            <p className="text-xs text-neutral-500 font-medium">Recent video plays and game sessions</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Streaming Live
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {ANALYTICS.recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === "video_view" ? "bg-coral-50 text-coral-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {item.type === "video_view" ? <Eye size={15} weight="bold" /> : <GameController size={15} weight="bold" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">{item.itemTitle}</p>
                  <p className="text-[10px] text-neutral-500 font-medium">
                    {item.type === "video_view" ? "Video Lesson" : "Interactive Game"} · Language: {item.language.toUpperCase()}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
