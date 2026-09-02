"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoCard from "@/components/video/VideoCard";
import { VIDEOS, getVideoTitle, getVideoDescription, formatDuration, formatViews } from "@/lib/data";
import { useLanguage } from "@/lib/language-context";
import { Eye, Clock, Tag, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language, t } = useLanguage();
  const video = VIDEOS.find((v) => v.id === id);

  if (!video) notFound();

  const title = getVideoTitle(video, language);
  const description = getVideoDescription(video, language);
  const related = VIDEOS.filter((v) => v.id !== id && (v.subject === video.subject || v.language === video.language)).slice(0, 4);

  const LANG_LABELS: Record<string, string> = { en: "English", hi: "हिंदी", kn: "ಕನ್ನಡ" };

  return (
    <div className="min-h-screen bg-transparent relative z-0 text-neutral-900">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container-xl">
          <Link href="/videos" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors mb-6">
            <ArrowLeft size={16} weight="bold" />
            Back to Videos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <VideoPlayer video={video} />

              {/* Info */}
              <div className="mt-6 rounded-3xl border border-neutral-200/90 bg-white/90 p-6 md:p-8 shadow-sm backdrop-blur-md">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-coral-50 text-coral-700 border border-coral-200 shadow-xs">
                    {LANG_LABELS[video.language]}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 border border-neutral-200 shadow-xs">
                    {video.subject}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 border border-neutral-200 shadow-xs">
                    {video.grade}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold font-display text-neutral-950 mb-3">
                  {title}
                </h1>

                <div className="flex items-center gap-6 text-xs text-neutral-500 font-semibold mb-6">
                  <span className="flex items-center gap-1.5">
                    <Eye size={15} className="text-coral-500" />
                    {formatViews(video.views)} {t("video.views")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} className="text-amber-500" />
                    {formatDuration(video.duration)} {t("minutes")}
                  </span>
                </div>

                <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 mb-5">
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">{description}</p>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={15} className="text-neutral-400" />
                  {video.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 shadow-2xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Related */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700 mb-4 font-display">
                {t("video.related")}
              </h2>
              <div className="flex flex-col gap-4">
                {related.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
