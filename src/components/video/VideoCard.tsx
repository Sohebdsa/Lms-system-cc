"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Eye, Clock, ArrowUpRight } from "@phosphor-icons/react";
import type { Video } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { formatDuration, formatViews, getVideoTitle } from "@/lib/data";

const LANG_LABELS: Record<string, string> = { en: "English", hi: "हिंदी", kn: "ಕನ್ನಡ" };

export default function VideoCard({ video, index = 0 }: { video: Video; index?: number }) {
  const { language } = useLanguage();
  const title = getVideoTitle(video, language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/videos/${video.id}`} className="group block h-full">
        <div className="relative h-full rounded-2xl overflow-hidden border border-neutral-200/90 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-neutral-300 hover:-translate-y-1 hover:shadow-lg shadow-xs">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-neutral-100">
            <Image
              src={video.thumbnailUrl}
              alt={title}
              fill
              priority={index < 3}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Language badge */}
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-white/90 text-neutral-800 border border-neutral-200 shadow-xs">
              {LANG_LABELS[video.language]}
            </div>

            {/* Duration */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[10px] text-white font-medium">
              <Clock size={10} weight="bold" />
              {formatDuration(video.duration)}
            </div>

            {/* Play button hover */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/15">
              <div className="w-14 h-14 rounded-full bg-[rgb(255_78_41)] flex items-center justify-center shadow-lg shadow-coral-500/40 text-white">
                <PlayCircle size={30} weight="fill" className="ml-0.5" />
              </div>
            </div>
          </div>

          {/* Card content */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-coral-600 uppercase tracking-widest">
                {video.subject}
              </span>
              <span className="text-[8px] text-neutral-300">•</span>
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                {video.grade}
              </span>
            </div>

            <h3 className="font-display text-sm font-bold text-neutral-900 leading-snug line-clamp-2 mb-3 group-hover:text-[rgb(255_78_41)] transition-colors duration-200">
              {title}
            </h3>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                <Eye size={12} />
                <span>{formatViews(video.views)}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700 group-hover:text-[rgb(255_78_41)] transition-colors">
                Watch
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
