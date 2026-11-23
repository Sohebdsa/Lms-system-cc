"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlass, GridFour, Rows, CaretDown } from "@phosphor-icons/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PosterHeading from "@/components/layout/PosterHeading";
import VideoCard from "@/components/video/VideoCard";
import { useVideos } from "@/lib/video-store";
import { SUBJECTS } from "@/lib/data";
import type { Language } from "@/types";

type LangFilter = "all" | Language;

const LANG_OPTS: { value: LangFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "kn", label: "ಕನ್ನಡ" },
];

export default function VideosPage() {
  const { videos } = useVideos();
  const [langFilter, setLangFilter] = useState<LangFilter>("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(true);

  const filtered = useMemo(() => videos.filter((v) => {
    const q = search.toLowerCase();
    const matchLang = langFilter === "all" || v.language === langFilter;
    const matchSubject = subjectFilter === "all" || v.subject === subjectFilter;
    const matchSearch = !search ||
      v.title.toLowerCase().includes(q) ||
      v.titleHi?.toLowerCase().includes(q) ||
      v.titleKn?.toLowerCase().includes(q);
    return matchLang && matchSubject && matchSearch;
  }), [videos, langFilter, subjectFilter, search]);

  return (
    <div className="min-h-screen relative z-0" style={{ color: "var(--ink)" }}>
      <Navbar />

      <header className="pt-32 pb-10 border-b-[1.5px]" style={{ borderColor: "var(--ink)" }}>
        <div className="container-xl">
          <PosterHeading
            as="h1"
            size="page"
            index="02"
            eyebrow="Multilingual library"
            title="Videos"
            stamp={`${videos.length} free lessons`}
          />

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <label className="relative w-full lg:max-w-72">
              <span className="sr-only">Search videos</span>
              <MagnifyingGlass size={16} weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ink)" }} />
              <input
                type="search"
                placeholder="Search videos…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="poster-input pl-11 pr-4 placeholder:text-[var(--muted)]"
              />
            </label>

            <div className="flex gap-2 flex-wrap" role="group" aria-label="Language">
              {LANG_OPTS.map((f) => (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => setLangFilter(f.value)}
                  aria-pressed={langFilter === f.value}
                  className="poster-chip"
                >
                  {f.label}
                </button>
              ))}
            </div>

            <label className="relative">
              <span className="sr-only">Subject</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="poster-chip appearance-none pr-9"
                style={{ backgroundColor: subjectFilter !== "all" ? "var(--haldi)" : "transparent", color: subjectFilter !== "all" ? "var(--on-haldi)" : "var(--ink)" }}
              >
                <option value="all">All subjects</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <CaretDown size={12} weight="bold" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
            </label>

            <div className="flex items-center gap-2 lg:ml-auto" role="group" aria-label="Layout">
              <button type="button" onClick={() => setGrid(true)} aria-pressed={grid} aria-label="Grid view" className="poster-chip px-2.5">
                <GridFour size={16} weight="bold" />
              </button>
              <button type="button" onClick={() => setGrid(false)} aria-pressed={!grid} aria-label="List view" className="poster-chip px-2.5">
                <Rows size={16} weight="bold" />
              </button>
            </div>
          </div>
          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <section className="py-14">
        <div className="container-xl">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <span className="grid place-items-center w-16 h-16 rounded-full border-[1.5px] mb-5 poster-shadow" style={{ borderColor: "var(--ink)", backgroundColor: "var(--surface)" }}>
                <MagnifyingGlass size={24} weight="bold" />
              </span>
              <p className="font-poster text-3xl mb-2">Nothing here yet</p>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>No videos match your filters.</p>
            </div>
          ) : (
            <div className={grid
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-5 max-w-3xl"
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
