"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoCard from "@/components/video/VideoCard";
import { VIDEOS, getVideoTitle, getVideoDescription, formatDuration, formatViews } from "@/lib/data";
import { useLanguage } from "@/lib/language-context";
import { Eye, Clock, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

// Language colours: Kannada=Haldi, Hindi=Sindoor, English=Indigo
const LANG_BADGE: Record<string, React.CSSProperties> = {
  en: { backgroundColor: "#2F4A73", color: "#fff" },
  hi: { backgroundColor: "#C4452E", color: "#fff" },
  kn: { backgroundColor: "#E2A93B", color: "#3A2420" },
};
const LANG_LABELS: Record<string, string> = { en: "English", hi: "हिंदी", kn: "ಕನ್ನಡ" };

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language, t } = useLanguage();
  const video = VIDEOS.find((v) => v.id === id);

  if (!video) notFound();

  const title = getVideoTitle(video, language);
  const description = getVideoDescription(video, language);
  const related = VIDEOS.filter((v) => v.id !== id && (v.subject === video.subject || v.language === video.language)).slice(0, 4);

  return (
    <div className="min-h-screen relative z-0" style={{ color: "var(--ink)" }}>
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container-xl">
          <Link href="/videos" className="poster-chip mb-8">
            <ArrowLeft size={14} weight="bold" />
            Back to videos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div data-perch="" data-perch-x="0.88" className="rounded-[22px] border-[1.5px] overflow-hidden poster-shadow" style={{ borderColor: "var(--ink)" }}>
                <VideoPlayer video={video} />
              </div>

              <section data-perch="" className="poster-card mt-8 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="poster-tag" style={LANG_BADGE[video.language]}>{LANG_LABELS[video.language]}</span>
                  <span className="poster-tag">{video.subject}</span>
                  <span className="poster-tag">{video.grade}</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4" style={{ color: "var(--ink)" }}>
                  {title}
                </h1>

                <div className="flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider mb-6" style={{ color: "var(--muted)" }}>
                  <span className="flex items-center gap-1.5">
                    <Eye size={15} weight="bold" style={{ color: "var(--sindoor)" }} />
                    {formatViews(video.views)} {t("video.views")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} weight="bold" style={{ color: "var(--haldi)" }} />
                    {formatDuration(video.duration)} {t("minutes")}
                  </span>
                </div>

                <div className="rounded-2xl border-[1.5px] border-dashed p-5 mb-6" style={{ borderColor: "color-mix(in srgb, var(--ink) 30%, transparent)", backgroundColor: "var(--bg)" }}>
                  <p className="text-sm md:text-base leading-relaxed font-medium" style={{ color: "var(--ink)" }}>{description}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {video.tags.map((tag) => (
                    <span key={tag} className="poster-tag normal-case" style={{ backgroundColor: "transparent", color: "var(--muted)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="poster-card p-5">
              <span className="poster-eyebrow mb-5">
                <b>Up next</b>
                {t("video.related")}
              </span>
              <div className="flex flex-col gap-5">
                {related.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
