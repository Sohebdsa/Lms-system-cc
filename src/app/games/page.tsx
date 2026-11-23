"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PosterHeading from "@/components/layout/PosterHeading";
import GameCard from "@/components/games/GameCard";
import { useLanguage } from "@/lib/language-context";
import { GAMES } from "@/lib/data";

export default function GamesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative z-0" style={{ color: "var(--ink)" }}>
      <Navbar />

      <header className="pt-32 pb-10 border-b-[1.5px]" style={{ borderColor: "var(--ink)" }}>
        <div className="container-xl">
          <PosterHeading
            as="h1"
            size="page"
            index="03"
            eyebrow="Interactive learning"
            title={t("games.title")}
            stamp={`${GAMES.length} games`}
          />
          <p className="text-base max-w-xl font-medium -mt-4" style={{ color: "var(--muted)" }}>{t("games.subtitle")}</p>
        </div>
      </header>

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
