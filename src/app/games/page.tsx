"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GameCard from "@/components/games/GameCard";
import { useLanguage } from "@/lib/language-context";
import { GAMES } from "@/lib/data";
import { motion } from "motion/react";
import { GameController } from "@phosphor-icons/react";

export default function GamesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-transparent relative z-0 text-neutral-900">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-10 border-b border-neutral-200/70">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-sm">
              <GameController size={26} weight="fill" className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Interactive Learning</p>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-neutral-950">
                {t("games.title")}
              </h1>
              <p className="text-sm text-neutral-600 mt-1 font-medium">{t("games.subtitle")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-14">
        <div className="container-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
