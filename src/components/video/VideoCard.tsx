"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Play, Eye, Clock, ArrowUpRight } from "@phosphor-icons/react";
import type { Video } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { formatDuration, formatViews, getVideoTitle } from "@/lib/data";

const LANG_LABELS: Record<string, string> = { en: "English", hi: "हिंदी", kn: "ಕನ್ನಡ" };

// Aangan language colours: Kannada = Haldi, Hindi = Sindoor, English = Indigo
const LANG_BADGE_STYLES: Record<string, React.CSSProperties> = {
  en: { backgroundColor: "#2F4A73", color: "#fff" },
  hi: { backgroundColor: "#C4452E", color: "#fff" },
  kn: { backgroundColor: "#E2A93B", color: "#3A2420" },
};

export default function VideoCard({ video, index = 0 }: { video: Video; index?: number }) {
  const { language } = useLanguage();
  const title = getVideoTitle(video, language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link href={`/videos/${video.id}`} className="group block h-full rounded-[22px] focus:outline-none">
        <article data-perch="" className="poster-card poster-card-hover relative h-full overflow-hidden flex flex-col">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden border-b-[1.5px]" style={{ borderColor: "var(--ink)", backgroundColor: "var(--border)" }}>
            <Image
              src={video.thumbnailUrl}
              alt={title}
              fill
              priority={index < 3}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <span
              className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full border-[1.5px] text-[10px] font-extrabold tracking-wider"
              style={{ borderColor: "#3A2420", ...(LANG_BADGE_STYLES[video.language] ?? { backgroundColor: "var(--surface)", color: "var(--ink)" }) }}
            >
              {LANG_LABELS[video.language]}
            </span>

            <span
              className="absolute bottom-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full border-[1.5px] text-[10px] font-extrabold"
              style={{ backgroundColor: "#FFFBF3", color: "#3A2420", borderColor: "#3A2420" }}
            >
              <Clock size={10} weight="bold" />
              {formatDuration(video.duration)}
            </span>

            {/* Play button */}
            <div className="absolute inset-0 z-10 grid place-items-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 bg-black/10">
              <span
                className="grid place-items-center w-14 h-14 rounded-full border-[1.5px] scale-90 group-hover:scale-100 transition-transform duration-300"
                style={{ backgroundColor: "var(--haldi)", borderColor: "#3A2420", color: "#3A2420" }}
              >
                <Play size={22} weight="fill" className="ml-0.5" />
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2.5 text-[10px] font-extrabold uppercase tracking-widest">
              <span style={{ color: "var(--sindoor)" }}>{video.subject}</span>
              <span aria-hidden style={{ color: "var(--haldi)" }}>✱</span>
              <span style={{ color: "var(--muted)" }}>{video.grade}</span>
            </div>

            <h3 className="text-base font-extrabold leading-snug line-clamp-2 mb-4" style={{ color: "var(--ink)" }}>
              {title}
            </h3>

            <div className="mt-auto flex items-center justify-between pt-3 border-t-[1.5px] border-dashed" style={{ borderColor: "color-mix(in srgb, var(--ink) 25%, transparent)" }}>
              <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--muted)" }}>
                <Eye size={12} />
                {formatViews(video.views)}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "var(--ink)" }}>
                <span className="poster-link">Watch</span>
                <ArrowUpRight size={12} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
