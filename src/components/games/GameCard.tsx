"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { GameController, Users, Lightning, ArrowUpRight } from "@phosphor-icons/react";
import type { Game } from "@/types";
import { formatViews } from "@/lib/data";

// Aangan difficulty colours
export const DIFFICULTY = {
  easy: { label: "Easy", style: { backgroundColor: "#7E9A6E", color: "#fff" } },
  medium: { label: "Medium", style: { backgroundColor: "#E2A93B", color: "#3A2420" } },
  hard: { label: "Hard", style: { backgroundColor: "#B8643F", color: "#fff" } },
} as const;

export default function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const diff = DIFFICULTY[game.difficulty];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link href={`/games/${game.slug}`} className="group block h-full rounded-[22px] focus:outline-none">
        <article data-perch="" className="poster-card poster-card-hover relative h-full overflow-hidden flex flex-col">
          {/* Thumbnail */}
          <div className="relative h-48 overflow-hidden border-b-[1.5px]" style={{ borderColor: "var(--ink)", backgroundColor: "var(--border)" }}>
            <Image
              src={game.thumbnail}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <span
              className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full border-[1.5px] text-[10px] font-extrabold uppercase tracking-wider"
              style={{ borderColor: "#3A2420", ...diff.style }}
            >
              {diff.label}
            </span>

            <div className="absolute inset-0 z-10 grid place-items-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 bg-black/10">
              <span
                className="grid place-items-center w-14 h-14 rounded-full border-[1.5px] scale-90 group-hover:scale-100 transition-transform duration-300"
                style={{ backgroundColor: "var(--haldi)", borderColor: "#3A2420", color: "#3A2420" }}
              >
                <GameController size={24} weight="fill" />
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-poster text-2xl mb-2" style={{ color: "var(--ink)" }}>
              {game.title}
            </h3>
            <p className="text-sm leading-relaxed line-clamp-2 mb-4 font-medium" style={{ color: "var(--muted)" }}>
              {game.description}
            </p>

            <div className="mt-auto flex items-center justify-between pt-3 border-t-[1.5px] border-dashed" style={{ borderColor: "color-mix(in srgb, var(--ink) 25%, transparent)" }}>
              <div className="flex items-center gap-3 text-[11px] font-semibold" style={{ color: "var(--muted)" }}>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {formatViews(game.plays)}
                </span>
                <span className="flex items-center gap-1">
                  <Lightning size={12} />
                  {game.ageRange}y
                </span>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "var(--ink)" }}>
                <span className="poster-link">Play</span>
                <ArrowUpRight size={12} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
