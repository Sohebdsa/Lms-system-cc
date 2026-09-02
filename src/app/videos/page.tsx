"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { MagnifyingGlass, GridFour, Rows } from "@phosphor-icons/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoCard from "@/components/video/VideoCard";
import { useVideos } from "@/lib/video-store";
import { useLanguage } from "@/lib/language-context";
import { SUBJECTS } from "@/lib/data";
import type { Language } from "@/types";

type LangFilter = "all" | Language;

export default function VideosPage() {
  const { t } = useLanguage();
  const { videos } = useVideos();
  const [langFilter, setLangFilter] = useState<LangFilter>("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(true);

  const filtered = useMemo(() => videos.filter((v) => {
    const matchLang = langFilter === "all" || v.language === langFilter;
    const matchSubject = subjectFilter === "all" || v.subject === subjectFilter;
    const matchSearch = !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.titleHi?.toLowerCase().includes(search.toLowerCase()) ||
      v.titleKn?.toLowerCase().includes(search.toLowerCase());
    return matchLang && matchSubject && matchSearch;
  }), [videos, langFilter, subjectFilter, search]);

  const LANG_OPTS: { value: LangFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "en",  label: "English" },
    { value: "hi",  label: "हिंदी" },
    { value: "kn",  label: "ಕನ್ನಡ" },
  ];

  return (
    <div className="min-h-screen bg-transparent relative z-0 text-neutral-900">
      <Navbar />
      <div className="pt-32 pb-8 border-b border-neutral-200/70">
        <div className="container-xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold text-[rgb(255_78_41)] uppercase tracking-widest mb-2">Multilingual Library</p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-2 text-neutral-950">Videos</h1>
            <p className="text-neutral-600 text-sm font-medium">{videos.length} free lessons in Kannada, Hindi &amp; English</p>
          </motion.div>

          {/* Filters */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <div className="relative max-w-64">
              <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-coral-500 shadow-xs transition-colors"
              />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {LANG_OPTS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setLangFilter(f.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    langFilter === f.value
                      ? "btn-coral text-white shadow-md shadow-coral-500/20"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-neutral-200 text-neutral-700 focus:outline-none focus:border-coral-500 cursor-pointer hover:bg-neutral-50 shadow-xs transition-colors"
            >
              <option value="all">All Subjects</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <div className="flex items-center gap-1 ml-auto p-1 rounded-xl bg-white border border-neutral-200 shadow-xs">
              <button onClick={() => setGrid(true)} className={`p-2 rounded-lg transition-all ${grid ? "bg-neutral-100 text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-700"}`}>
                <GridFour size={16} />
              </button>
              <button onClick={() => setGrid(false)} className={`p-2 rounded-lg transition-all ${!grid ? "bg-neutral-100 text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-700"}`}>
                <Rows size={16} />
              </button>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-neutral-500 font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container-xl">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-4 shadow-xs">
                <MagnifyingGlass size={22} className="text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-600 font-medium">No videos match your filters.</p>
            </div>
          ) : (
            <div className={grid
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
            }>
              {filtered.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
