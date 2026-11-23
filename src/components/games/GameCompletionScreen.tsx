"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ArrowCounterClockwise, ArrowRight, GameController, Sparkle } from "@phosphor-icons/react";
import { GAMES } from "@/lib/data";

interface GameCompletionScreenProps {
  score: number;
  stats?: { label: string; value: string | number }[];
  onRetry: () => void;
  currentGameSlug: string;
  title?: string;
  message?: string;
}

export default function GameCompletionScreen({
  score,
  stats = [],
  onRetry,
  currentGameSlug,
  title = "Awesome Job! Game Completed!",
  message = "You finished all questions! Keep up the great learning streak.",
}: GameCompletionScreenProps) {
  const recommendations = GAMES.filter((g) => g.slug !== currentGameSlug).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center w-full max-w-xl mx-auto py-4"
    >
      {/* Trophy */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl border-2 flex items-center justify-center shadow-lg animate-bounce"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", color: "var(--accent)" }}>
          <Trophy size={44} weight="fill" />
        </div>
        <div className="absolute -top-1 -right-1 animate-pulse" style={{ color: "var(--primary)" }}>
          <Sparkle size={20} weight="fill" />
        </div>
      </div>

      <h2 className="font-display text-3xl font-extrabold mb-2" style={{ color: "var(--text)" }}>
        {title}
      </h2>
      <p className="text-sm max-w-md mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
        {message}
      </p>

      {/* Score and Stats Banner */}
      <div className="w-full rounded-2xl border p-5 mb-7 shadow-xs"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Final Score</span>
          <span className="font-display text-3xl font-extrabold" style={{ color: "var(--primary)" }}>{score}</span>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[11px] font-semibold uppercase" style={{ color: "var(--muted)" }}>{stat.label}</span>
                <span className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-8">
        <button
          onClick={onRetry}
          className="btn-coral flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold shadow-md active:scale-95 transition-transform"
        >
          <ArrowCounterClockwise size={18} weight="bold" />
          <span>Play Again / Retry</span>
        </button>

        <Link
          href="/games"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold border transition-colors shadow-xs"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <GameController size={18} weight="bold" />
          <span>All Games Lobby</span>
        </Link>
      </div>

      {/* Other Games Recommendations */}
      <div className="w-full pt-6 border-t text-left" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Recommended Next Games</p>
          <Link href="/games" className="text-xs font-bold flex items-center gap-1 transition-colors"
            style={{ color: "var(--teal)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--secondary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--teal)")}>
            Browse All <ArrowRight size={12} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          {recommendations.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group flex items-center gap-3 p-3 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--teal)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: "var(--border)" }}>
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold truncate transition-colors" style={{ color: "var(--text)" }}>
                  {game.title}
                </p>
                <p className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                  {game.ageRange} yrs · {game.difficulty}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{ backgroundColor: "var(--border)", color: "var(--text)" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--teal)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}>
                <ArrowRight size={14} weight="bold" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
