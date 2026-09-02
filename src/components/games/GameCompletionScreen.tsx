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
  // Recommend 2 other games
  const recommendations = GAMES.filter((g) => g.slug !== currentGameSlug).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center w-full max-w-xl mx-auto py-4"
    >
      {/* Trophy / Celebration Icon */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20 text-amber-500 animate-bounce">
          <Trophy size={44} weight="fill" />
        </div>
        <div className="absolute -top-1 -right-1 text-coral-500 animate-pulse">
          <Sparkle size={20} weight="fill" />
        </div>
      </div>

      <h2 className="font-display text-3xl font-extrabold text-neutral-950 mb-2">
        {title}
      </h2>
      <p className="text-sm text-neutral-600 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {/* Score and Stats Banner */}
      <div className="w-full rounded-2xl bg-neutral-50 border border-neutral-200 p-5 mb-7 shadow-xs">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Final Score</span>
          <span className="font-display text-3xl font-extrabold text-coral-600">{score}</span>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-200/80">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase">{stat.label}</span>
                <span className="font-display text-lg font-bold text-neutral-900">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-8">
        <button
          onClick={onRetry}
          className="btn-coral flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold shadow-md shadow-coral-500/25 active:scale-95 transition-transform"
        >
          <ArrowCounterClockwise size={18} weight="bold" />
          <span>Play Again / Retry</span>
        </button>

        <Link
          href="/games"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 shadow-xs transition-colors"
        >
          <GameController size={18} weight="bold" />
          <span>All Games Lobby</span>
        </Link>
      </div>

      {/* Other Games Recommendations */}
      <div className="w-full pt-6 border-t border-neutral-200 text-left">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Recommended Next Games</p>
          <Link href="/games" className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1">
            Browse All <ArrowRight size={12} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          {recommendations.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-coral-300 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold text-neutral-900 group-hover:text-coral-600 transition-colors truncate">
                  {game.title}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {game.ageRange} yrs · {game.difficulty}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-coral-500 text-neutral-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight size={14} weight="bold" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
