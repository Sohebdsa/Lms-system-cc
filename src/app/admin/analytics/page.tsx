"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Eye, GameController, Clock, Globe, DownloadSimple, TrendUp,
  Calendar, CheckCircle, ArrowUpRight
} from "@phosphor-icons/react";
import { ANALYTICS, GAMES, formatViews, formatDuration } from "@/lib/data";
import { useVideos } from "@/lib/video-store";
import Image from "next/image";

export default function AnalyticsPage() {
  const { videos } = useVideos();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  const totalVideoViews = videos.reduce((acc, v) => acc + v.views, 0) || ANALYTICS.totalVideoViews;
  const multiplier = timeRange === "7d" ? 0.35 : timeRange === "30d" ? 1 : 2.4;

  const LANG_DATA = [
    { lang: "Kannada (ಕನ್ನಡ)", key: "kn", views: Math.round(ANALYTICS.viewsByLanguage.kn * multiplier), color: "bg-emerald-500", barColor: "#10b981" },
    { lang: "Hindi (हिंदी)", key: "hi", views: Math.round(ANALYTICS.viewsByLanguage.hi * multiplier), color: "bg-amber-500", barColor: "#f59e0b" },
    { lang: "English", key: "en", views: Math.round(ANALYTICS.viewsByLanguage.en * multiplier), color: "bg-coral-500", barColor: "#ff4e29" },
  ];

  const totalLangViews = LANG_DATA.reduce((s, l) => s + l.views, 0);

  // CSV export
  const downloadCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Video Views", Math.round(totalVideoViews * multiplier)],
      ["Total Game Plays", Math.round(ANALYTICS.totalGamePlays * multiplier)],
      ["Avg Watch Duration (Seconds)", ANALYTICS.avgWatchDuration],
      ["Time Range", timeRange],
      ...LANG_DATA.map((l) => [`Views - ${l.lang}`, l.views]),
      ...videos.map((v) => [`Video: ${v.title}`, v.views]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bridged_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-neutral-950">
            Analytics & Impact Reports
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Student engagement, language reach, and content retention statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range toggle */}
          <div className="flex p-1 bg-white border border-neutral-200 rounded-xl shadow-xs">
            {(["7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeRange === r
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "All Time"}
              </button>
            ))}
          </div>

          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-coral text-xs font-bold shadow-md shadow-coral-500/20 active:scale-95 transition-all"
          >
            <DownloadSimple size={16} weight="bold" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center mb-4">
            <Eye size={20} weight="bold" />
          </div>
          <p className="text-3xl font-extrabold font-display text-neutral-950">
            {formatViews(Math.round(totalVideoViews * multiplier))}
          </p>
          <p className="text-xs font-bold text-neutral-500 mt-1">Total Video Lessons Streamed</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendUp size={12} weight="bold" />
            +18.4% growth in rural engagement
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <GameController size={20} weight="bold" />
          </div>
          <p className="text-3xl font-extrabold font-display text-neutral-950">
            {formatViews(Math.round(ANALYTICS.totalGamePlays * multiplier))}
          </p>
          <p className="text-xs font-bold text-neutral-500 mt-1">Interactive Game Sessions</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendUp size={12} weight="bold" />
            +12.1% repeat plays
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Clock size={20} weight="bold" />
          </div>
          <p className="text-3xl font-extrabold font-display text-neutral-950">
            {formatDuration(ANALYTICS.avgWatchDuration)}
          </p>
          <p className="text-xs font-bold text-neutral-500 mt-1">Average Session Duration</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle size={12} weight="fill" />
            74% Lesson Completion Rate
          </div>
        </div>
      </div>

      {/* Language Breakdown & Game Plays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} weight="bold" className="text-coral-500" />
            <h2 className="text-base font-bold font-display text-neutral-950">
              Multilingual Reach
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mb-6 font-medium">Views distribution by student language choice</p>

          <div className="space-y-4">
            {LANG_DATA.map((item) => {
              const pct = Math.round((item.views / totalLangViews) * 100);
              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-neutral-800">{item.lang}</span>
                    <span className="text-neutral-900 font-mono">
                      {formatViews(item.views)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 leading-relaxed font-medium">
            💡 <strong>Impact Note:</strong> Kannada and Hindi represent over <strong>65%</strong> of total student watch hours, supporting Collective Consciousness's rural literacy mission.
          </div>
        </div>

        {/* Top Games Engagement */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <GameController size={18} weight="bold" className="text-amber-500" />
            <h2 className="text-base font-bold font-display text-neutral-950">
              Interactive Games Engagement
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mb-6 font-medium">Most popular learning games among primary students</p>

          <div className="space-y-3.5">
            {GAMES.sort((a, b) => b.plays - a.plays).map((game, i) => {
              const plays = Math.round(game.plays * multiplier);
              return (
                <div key={game.id} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-neutral-400 w-4 text-center">{i + 1}</span>
                  <div className="relative w-12 h-8 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image src={game.thumbnail} alt={game.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">{game.title}</p>
                    <div className="h-1.5 rounded-full bg-neutral-100 mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(game.plays / GAMES[0].plays) * 100}%` }}
                        transition={{ duration: 0.7, delay: i * 0.08 }}
                        className="h-full rounded-full bg-amber-500"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-800 tabular-nums">
                    {formatViews(plays)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
