"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Plus, Pencil, Trash, Eye, Clock, MagnifyingGlass, X, Check,
  UploadSimple, Play, VideoCamera, Sparkle, Link as LinkIcon
} from "@phosphor-icons/react";
import { SUBJECTS, GRADES, formatViews, formatDuration } from "@/lib/data";
import { useVideos } from "@/lib/video-store";
import type { Video, Language } from "@/types";

const LANG_LABELS: Record<Language, string> = { en: "English", hi: "हिंदी", kn: "ಕನ್ನಡ" };

const SAMPLE_THUMBNAILS = [
  "https://picsum.photos/seed/math-sample/640/360",
  "https://picsum.photos/seed/science-sample/640/360",
  "https://picsum.photos/seed/language-sample/640/360",
  "https://picsum.photos/seed/nature-sample/640/360",
];

export default function AdminVideosPage() {
  const { videos, addVideo, updateVideo, deleteVideo } = useVideos();
  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [titleKn, setTitleKn] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState(GRADES[0]);
  const [language, setLanguage] = useState<Language>("en");
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");
  const [thumbnailUrl, setThumbnailUrl] = useState(SAMPLE_THUMBNAILS[0]);
  const [duration, setDuration] = useState(300);
  const [tagsInput, setTagsInput] = useState("education, learning");

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setTitleHi("");
    setTitleKn("");
    setDescription("");
    setSubject(SUBJECTS[0]);
    setGrade(GRADES[0]);
    setLanguage("en");
    setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
    setThumbnailUrl(SAMPLE_THUMBNAILS[Math.floor(Math.random() * SAMPLE_THUMBNAILS.length)]);
    setDuration(360);
    setTagsInput("free, lesson, school");
    setIsModalOpen(true);
  };

  const openEditModal = (video: Video) => {
    setEditingId(video.id);
    setTitle(video.title);
    setTitleHi(video.titleHi || "");
    setTitleKn(video.titleKn || "");
    setDescription(video.description);
    setSubject(video.subject);
    setGrade(video.grade);
    setLanguage(video.language);
    setVideoUrl(video.videoUrl);
    setThumbnailUrl(video.thumbnailUrl);
    setDuration(video.duration);
    setTagsInput(video.tags.join(", "));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingId) {
      updateVideo(editingId, {
        title,
        titleHi: titleHi || undefined,
        titleKn: titleKn || undefined,
        description,
        subject,
        grade,
        language,
        videoUrl,
        thumbnailUrl,
        duration: Number(duration),
        tags,
      });
    } else {
      addVideo({
        title,
        titleHi: titleHi || undefined,
        titleKn: titleKn || undefined,
        description,
        subject,
        grade,
        language,
        videoUrl,
        thumbnailUrl,
        duration: Number(duration),
        tags,
      });
    }

    setIsModalOpen(false);
  };

  const filtered = videos.filter((v) => {
    const matchSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.subject.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchLang = selectedLang === "all" || v.language === selectedLang;
    const matchSub = selectedSubject === "all" || v.subject === selectedSubject;
    return matchSearch && matchLang && matchSub;
  });

  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display" style={{ color: "var(--text)" }}>
            Video Management
          </h1>
          <p className="text-xs mt-1 font-medium" style={{ color: "var(--muted)" }}>
            Publish, edit, and organize multilingual educational content
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-coral inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
        >
          <Plus size={18} weight="bold" />
          <span>Upload New Video</span>
        </button>
      </div>

      {/* Stats Summary Bar - 60% Beige Surface */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border p-4 shadow-xs" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total Published</p>
          <p className="text-2xl font-extrabold font-display mt-1" style={{ color: "var(--text)" }}>{videos.length}</p>
        </div>
        <div className="rounded-2xl border p-4 shadow-xs" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total Views</p>
          <p className="text-2xl font-extrabold font-display mt-1" style={{ color: "var(--primary)" }}>{formatViews(totalViews)}</p>
        </div>
        <div className="rounded-2xl border p-4 shadow-xs" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Languages</p>
          <p className="text-2xl font-extrabold font-display mt-1" style={{ color: "var(--text)" }}>3 (EN/HI/KN)</p>
        </div>
        <div className="rounded-2xl border p-4 shadow-xs" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Storage State</p>
          <p className="text-2xl font-extrabold font-display mt-1" style={{ color: "var(--success)" }}>Healthy</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="search"
            placeholder="Search by title, subject, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none shadow-xs transition-colors"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Language filter */}
          <div className="flex rounded-xl border p-1 shadow-xs" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            {["all", "en", "hi", "kn"].map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLang(l)}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                style={
                  selectedLang === l
                    ? { backgroundColor: "var(--secondary)", color: "#FFFFFF" }
                    : { color: "var(--text)", backgroundColor: "transparent" }
                }
              >
                {l === "all" ? "All Languages" : LANG_LABELS[l as Language]}
              </button>
            ))}
          </div>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs focus:outline-none transition-colors border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Table - 60% Beige Surface */}
      <div className="rounded-3xl border shadow-sm overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ backgroundColor: "color-mix(in srgb, var(--border) 35%, var(--surface))", borderColor: "var(--border)" }}>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Video &amp; Title</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Language</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Subject</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Grade</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Views</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Duration</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map((video) => (
                <tr
                  key={video.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--border) 25%, var(--surface))")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {/* Thumbnail & Title */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-10 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                        <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{video.title}</p>
                        <p className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                          {video.tags.map((t) => `#${t}`).join(" ")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="px-4 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                      style={
                        video.language === "en"
                          ? { backgroundColor: "var(--secondary)", color: "#FFFFFF", borderColor: "var(--secondary)" }
                          : video.language === "hi"
                          ? { backgroundColor: "var(--primary)", color: "#FFFFFF", borderColor: "var(--primary)" }
                          : { backgroundColor: "var(--accent)", color: "#3A2420", borderColor: "var(--accent)" }
                      }
                    >
                      {LANG_LABELS[video.language]}
                    </span>
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: "var(--text)" }}>
                    {video.subject}
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    {video.grade}
                  </td>

                  {/* Views */}
                  <td className="px-4 py-3.5 text-xs font-bold tabular-nums" style={{ color: "var(--text)" }}>
                    {formatViews(video.views)}
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3.5 text-xs tabular-nums" style={{ color: "var(--muted)" }}>
                    {formatDuration(video.duration)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(video)}
                        className="p-2 rounded-xl transition-colors"
                        style={{ color: "var(--secondary)" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--secondary) 12%, transparent)")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                        title="Edit video"
                      >
                        <Pencil size={16} weight="bold" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(video.id)}
                        className="p-2 rounded-xl transition-colors"
                        style={{ color: "var(--primary)" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 12%, transparent)")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                        title="Delete video"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm" style={{ color: "var(--muted)" }}>
                    No videos found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── ADD / EDIT VIDEO MODAL ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>
                    <UploadSimple size={18} weight="bold" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg" style={{ color: "var(--text)" }}>
                    {editingId ? "Edit Video Details" : "Upload New Educational Video"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--border) 40%, transparent)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
                {/* Title Inputs */}
                <div>
                  <label className="block mb-1" style={{ color: "var(--text)" }}>Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction to Fractions"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-normal focus:outline-none transition-colors"
                    style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1" style={{ color: "var(--muted)" }}>Title in Hindi (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. भिन्न का परिचय"
                      value={titleHi}
                      onChange={(e) => setTitleHi(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-normal focus:outline-none transition-colors"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div>
                    <label className="block mb-1" style={{ color: "var(--muted)" }}>Title in Kannada (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ಭಿನ್ನರಾಶಿಗಳ ಪರಿಚಯ"
                      value={titleKn}
                      onChange={(e) => setTitleKn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-normal focus:outline-none transition-colors"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1" style={{ color: "var(--text)" }}>Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Brief explanation of lesson topics..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-sm font-normal focus:outline-none transition-colors"
                    style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>

                {/* Subject, Grade, Language */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1" style={{ color: "var(--text)" }}>Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1" style={{ color: "var(--text)" }}>Grade Level</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1" style={{ color: "var(--text)" }}>Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    </select>
                  </div>
                </div>

                {/* Media URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1" style={{ color: "var(--text)" }}>Video MP4 URL</label>
                    <input
                      type="url"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none transition-colors"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>

                  <div>
                    <label className="block mb-1" style={{ color: "var(--text)" }}>Duration (Seconds)</label>
                    <input
                      type="number"
                      required
                      min={30}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none transition-colors"
                      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div>
                  <label className="block mb-1" style={{ color: "var(--text)" }}>Thumbnail Image URL</label>
                  <input
                    type="url"
                    required
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none transition-colors mb-2"
                    style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]" style={{ color: "var(--muted)" }}>Pick sample:</span>
                    {SAMPLE_THUMBNAILS.map((thumb, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setThumbnailUrl(thumb)}
                        className="px-2 py-0.5 rounded-lg border text-[10px] transition-colors"
                        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                      >
                        Sample {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block mb-1" style={{ color: "var(--text)" }}>Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. math, numbers, addition"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-normal focus:outline-none transition-colors"
                    style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--secondary)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: "var(--border)" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--border) 40%, transparent)")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-coral px-6 py-2.5 rounded-xl text-sm font-bold shadow-md"
                  >
                    {editingId ? "Save Changes" : "Publish Video"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRM MODAL ─── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl text-center"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                <Trash size={24} weight="bold" />
              </div>
              <h4 className="font-display font-bold text-lg mb-2" style={{ color: "var(--text)" }}>Delete this video?</h4>
              <p className="text-xs mb-6" style={{ color: "var(--muted)" }}>
                This action cannot be undone. The video will be removed from both the public library and the admin catalog.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors"
                  style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteVideo(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}