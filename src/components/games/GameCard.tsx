"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { GameController, Users, Lightning, ArrowUpRight } from "@phosphor-icons/react";
import type { Game } from "@/types";
import { formatViews } from "@/lib/data";

const DIFF = {
  easy: { label: "Easy", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  medium: { label: "Medium", cls: "text-amber-700 bg-amber-50 border-amber-200" },
  hard: { label: "Hard", cls: "text-rose-700 bg-rose-50 border-rose-200" },
};

export default function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/games/${game.slug}`} className="group block h-full">
        <div className="relative h-full rounded-2xl overflow-hidden border border-neutral-200/90 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-neutral-300 hover:-translate-y-1 hover:shadow-lg shadow-xs">
          {/* Thumbnail */}
          <div className="relative h-44 overflow-hidden bg-neutral-100">
            <Image
              src={game.thumbnail}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Difficulty */}
            <div className={`absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${DIFF[game.difficulty].cls}`}>
              {DIFF[game.difficulty].label}
            </div>

            {/* Play overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/15">
              <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40 text-white">
                <GameController size={26} weight="fill" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-bold text-neutral-900 mb-1.5 group-hover:text-amber-600 transition-colors duration-200">
              {game.title}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-4">
              {game.description}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                  <Users size={12} />
                  {formatViews(game.plays)}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                  <Lightning size={12} />
                  {game.ageRange}y
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700 group-hover:text-amber-600 transition-colors">
                Play <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
