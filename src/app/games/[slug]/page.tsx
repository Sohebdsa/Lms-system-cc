"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GAMES } from "@/lib/data";
import { useLanguage } from "@/lib/language-context";
import { ArrowLeft, Star, Users } from "@phosphor-icons/react";
import Link from "next/link";
import { formatViews } from "@/lib/data";
import dynamic from "next/dynamic";

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  "picture-puzzle": dynamic(() => import("@/components/games/PuzzleGame"), { ssr: false }),
  "word-matching": dynamic(() => import("@/components/games/MatchingGame"), { ssr: false }),
  "fruit-counter": dynamic(() => import("@/components/games/FruitCounterGame"), { ssr: false }),
  "color-sort": dynamic(() => import("@/components/games/ColorSortGame"), { ssr: false }),
  "letter-scramble": dynamic(() => import("@/components/games/LetterScrambleGame"), { ssr: false }),
};

const DIFFICULTY_LABELS = { easy: "Easy", medium: "Medium", hard: "Hard" };
const DIFFICULTY_COLORS = {
  easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  hard: "text-rose-700 bg-rose-50 border-rose-200",
};

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLanguage();
  const game = GAMES.find((g) => g.slug === slug);

  if (!game) notFound();

  const GameComponent = GAME_COMPONENTS[slug];

  return (
    <div className="min-h-screen bg-transparent relative z-0 text-neutral-900">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container-xl">
          <Link href="/games" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors mb-6">
            <ArrowLeft size={16} weight="bold" />
            Back to Games
          </Link>

          {/* Game header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold font-display text-neutral-950 mb-2">
                {game.title}
              </h1>
              <p className="text-sm text-neutral-600 max-w-lg leading-relaxed font-medium">{game.description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border shadow-xs ${DIFFICULTY_COLORS[game.difficulty]}`}>
                {DIFFICULTY_LABELS[game.difficulty]}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-xs">
                <Users size={14} className="text-coral-500" />
                {formatViews(game.plays)} {t("games.plays")}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-xs">
                <Star size={14} weight="fill" className="text-amber-500" />
                {t("age")} {game.ageRange}y
              </span>
            </div>
          </div>

          {/* Game area */}
          <div className="rounded-3xl border border-neutral-200/90 bg-white/90 backdrop-blur-md p-6 md:p-10 shadow-lg">
            {GameComponent ? (
              <GameComponent />
            ) : (
              <p className="text-center text-neutral-500 py-12">Game loading...</p>
            )}
          </div>

          {/* Subjects */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t("subjects")}:</span>
            {game.subjects.map((s) => (
              <span key={s} className="px-3 py-1 rounded-xl text-xs font-bold text-neutral-700 bg-white border border-neutral-200 shadow-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
