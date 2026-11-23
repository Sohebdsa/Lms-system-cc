"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Eye, GameController, Clock, Globe, DownloadSimple, TrendUp,
  CheckCircle,
} from "@phosphor-icons/react";
import { ANALYTICS, GAMES, formatViews, formatDuration } from "@/lib/data";
import { useVideos } from "@/lib/video-store";
import Image from "next/image";

// Language bar colours from Aangan palette
const LANG_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  kn: { bar: "#E2A93B", bg: "color-mix(in srgb, #E2A93B 10%, transparent)", text: "#3A2420" },
  hi: { bar: "#C4452E", bg: "color-mix(in srgb, #C4452E 10%, transparent)", text: "#C4452E" },
  en: { bar: "#2F4A73", bg: "color-mix(in srgb, #2F4A73 10%, transparent)", text: "#2F4A73" },
};

export default function AnalyticsPage() {
  const { videos } = useVideos();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  const totalVideoViews = videos.reduce((acc, v) => acc + v.views, 0) || ANALYTICS.totalVideoViews;
  const multiplier = timeRange === "7d" ? 0.35 : timeRange === "30d" ? 1 : 2.4;

  const LANG_DATA = [
    { lang: "Kannada (ಕನ್ನಡ)", key: "kn", views: Math.round(ANALYTICS.viewsByLanguage.kn * multiplier) },
    { lang: "Hindi (हिंदी)", key: "hi", views: Math.round(ANALYTICS.viewsByLanguage.hi * multiplier) },
    { lang: "English", key: "en", views: Math.round(ANALYTICS.viewsByLanguage.en * multiplier) },
  ];

  const totalLangViews = LANG_DATA.reduce((s, l) => s + l.views, 0);

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

  const cardStyle = { backgroundColor: "var(--surface)", borderColor: "var(--border)" };

  const metricIcons = [
    { icon: Eye, iconBg: "color-mix(in srgb, var(--primary) 10%, transparent)", iconColor: "var(--primary)", value: formatViews(Math.round(totalVideoViews * multiplier)), label: "Total Video Lessons Streamed", growth: "+18.4% growth in rural engagement" },
    { icon: GameController, iconBg: "color-mix(in srgb, var(--teal) 10%, transparent)", iconColor: "var(--teal)", value: formatViews(Math.round(ANALYTICS.totalGamePlays * multiplier)), label: "Interactive Game Sessions", growth: "+12.1% repeat plays" },
    { icon: Clock, iconBg: "color-mix(in srgb, var(--success) 10%, transparent)", iconColor: "var(--success)", value: formatDuration(ANALYTICS.avgWatchDuration), label: "Average Session Duration", growth: "74% Lesson Completion Rate" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display" style={{ color: "var(--text)" }}>Analytics &amp; Impact Reports</h1>
          <p className="text-xs mt-1 font-medium" style={{ color: "var(--muted)" }}>Student engagement, language reach, and content retention statistics</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl border shadow-xs" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            {(["7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                style={timeRange === r
                  ? { backgroundColor: "var(--secondary)", color: "#fff" }
                  : { color: "var(--muted)" }}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "All Time"}
              </button>
            ))}
          </div>

          <button onClick={downloadCSV} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-coral text-xs font-bold shadow-md active:scale-95 transition-all">
            <DownloadSimple size={16} weight="bold" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricIcons.map((m, i) => (
          <div key={i} className="rounded-3xl border p-6 shadow-xs" style={cardStyle}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: m.iconBg, color: m.iconColor }}>
              <m.icon size={20} weight="bold" />
            </div>
            <p className="text-3xl font-extrabold font-display" style={{ color: "var(--text)" }}>{m.value}</p>
            <p className="text-xs font-bold mt-1" style={{ color: "var(--muted)" }}>{m.label}</p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold" style={{ color: "var(--success)" }}>
              <TrendUp size={12} weight="bold" />
              {m.growth}
            </div>
          </div>
        ))}
      </div>

      {/* Language & Games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <div className="rounded-3xl border p-6 shadow-xs" style={cardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} weight="bold" style={{ color: "var(--primary)" }} />
            <h2 className="text-base font-bold font-display" style={{ color: "var(--text)" }}>Multilingual Reach</h2>
          </div>
          <p className="text-xs mb-6 font-medium" style={{ color: "var(--muted)" }}>Views distribution by student language choice</p>

          <div className="space-y-4">
            {LANG_DATA.map((item) => {
              const pct = Math.round((item.views / totalLangViews) * 100);
              const c = LANG_COLORS[item.key];
              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span style={{ color: "var(--text)" }}>{item.lang}</span>
                    <span className="font-mono" style={{ color: "var(--text)" }}>{formatViews(item.views)} ({pct}%)</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: c.bar }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-2xl border text-xs leading-relaxed font-medium"
            style={{ backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)", borderColor: "var(--border)", color: "var(--muted)" }}>
            💡 <strong style={{ color: "var(--text)" }}>Impact Note:</strong> Kannada and Hindi represent over <strong style={{ color: "var(--text)" }}>65%</strong> of total student watch hours, supporting Collective Consciousness's rural literacy mission.
          </div>
        </div>

        {/* Top Games Engagement */}
        <div className="rounded-3xl border p-6 shadow-xs" style={cardStyle}>
          <div className="flex items-center gap-2 mb-2">
            <GameController size={18} weight="bold" style={{ color: "var(--teal)" }} />
            <h2 className="text-base font-bold font-display" style={{ color: "var(--text)" }}>Interactive Games Engagement</h2>
          </div>
          <p className="text-xs mb-6 font-medium" style={{ color: "var(--muted)" }}>Most popular learning games among primary students</p>

          <div className="space-y-3.5">
            {GAMES.sort((a, b) => b.plays - a.plays).map((game, i) => {
              const plays = Math.round(game.plays * multiplier);
              return (
                <div key={game.id} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold w-4 text-center" style={{ color: "var(--muted)" }}>{i + 1}</span>
                  <div className="relative w-12 h-8 rounded-xl overflow-hidden shrink-0 border" style={{ backgroundColor: "var(--border)", borderColor: "var(--border)" }}>
                    <Image src={game.thumbnail} alt={game.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>{game.title}</p>
                    <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(game.plays / GAMES[0].plays) * 100}%` }}
                        transition={{ duration: 0.7, delay: i * 0.08 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: "var(--teal)" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold tabular-nums" style={{ color: "var(--text)" }}>{formatViews(plays)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
