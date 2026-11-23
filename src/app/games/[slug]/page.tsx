"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DIFFICULTY } from "@/components/games/GameCard";
import { GAMES, formatViews } from "@/lib/data";
import { useLanguage } from "@/lib/language-context";
import { ArrowLeft, Star, Users } from "@phosphor-icons/react";
import Link from "next/link";
import dynamic from "next/dynamic";

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  "picture-puzzle": dynamic(() => import("@/components/games/PuzzleGame"), { ssr: false }),
  "word-matching": dynamic(() => import("@/components/games/MatchingGame"), { ssr: false }),
  "fruit-counter": dynamic(() => import("@/components/games/FruitCounterGame"), { ssr: false }),
  "color-sort": dynamic(() => import("@/components/games/ColorSortGame"), { ssr: false }),
  "letter-scramble": dynamic(() => import("@/components/games/LetterScrambleGame"), { ssr: false }),
};

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLanguage();
  const game = GAMES.find((g) => g.slug === slug);

  if (!game) notFound();

  const GameComponent = GAME_COMPONENTS[slug];
  const diff = DIFFICULTY[game.difficulty];

  return (
    <div className="min-h-screen relative z-0" style={{ color: "var(--ink)" }}>
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container-xl">
          <Link href="/games" className="poster-chip mb-8">
            <ArrowLeft size={14} weight="bold" />
            Back to games
          </Link>

          {/* Game header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="poster-eyebrow mb-4">
                <b>Play</b>
                {game.subjects.join(" · ")}
              </span>
              <h1 className="font-poster mb-3" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--ink)" }}>
                {game.title}
              </h1>
              <p className="text-base max-w-xl leading-relaxed font-medium" style={{ color: "var(--muted)" }}>{game.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <span className="poster-tag" style={diff.style}>{diff.label}</span>
              <span className="poster-tag">
                <Users size={13} weight="bold" style={{ color: "var(--sindoor)" }} />
                {formatViews(game.plays)} {t("games.plays")}
              </span>
              <span className="poster-tag">
                <Star size={13} weight="fill" style={{ color: "var(--haldi)" }} />
                {t("age")} {game.ageRange}y
              </span>
            </div>
          </div>

          {/* Game area */}
          <div data-perch="" data-perch-x="0.9" className="poster-card poster-shadow p-6 md:p-10">
            {GameComponent ? (
              <GameComponent />
            ) : (
              <p className="text-center py-12 font-semibold" style={{ color: "var(--muted)" }}>Game loading…</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
