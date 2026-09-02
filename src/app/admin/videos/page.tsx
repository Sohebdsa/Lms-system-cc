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
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-neutral-950">
            Video Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Publish, edit, and organize multilingual educational content
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-coral inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-coral-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} weight="bold" />
          <span>Upload New Video</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white border border-neutral-200/90 p-4 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Published</p>
          <p className="text-2xl font-extrabold font-display text-neutral-950 mt-1">{videos.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-neutral-200/90 p-4 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Views</p>
          <p className="text-2xl font-extrabold font-display text-coral-600 mt-1">{formatViews(totalViews)}</p>
        </div>
        <div className="rounded-2xl bg-white border border-neutral-200/90 p-4 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Languages</p>
          <p className="text-2xl font-extrabold font-display text-neutral-950 mt-1">3 (EN/HI/KN)</p>
        </div>
        <div className="rounded-2xl bg-white border border-neutral-200/90 p-4 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Storage State</p>
          <p className="text-2xl font-extrabold font-display text-emerald-600 mt-1">Healthy</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search by title, subject, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-coral-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Language filter */}
          <div className="flex rounded-xl bg-white border border-neutral-200 p-1 shadow-xs">
            {["all", "en", "hi", "kn"].map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLang === l
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                {l === "all" ? "All Languages" : LANG_LABELS[l as Language]}
              </button>
            ))}
          </div>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-700 shadow-xs focus:outline-none focus:border-coral-500"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Table */}
      <div className="rounded-3xl border border-neutral-200/90 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70">
                <th className="px-5 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Video & Title</th>
                <th className="px-4 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Language</th>
                <th className="px-4 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Views</th>
                <th className="px-4 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((video) => (
                <tr key={video.id} className="hover:bg-neutral-50/60 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-10 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80">
                        <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="text-sm font-bold text-neutral-900 truncate">{video.title}</p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {video.tags.map((t) => `#${t}`).join(" ")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-neutral-100 border border-neutral-200 text-neutral-800">
                      {LANG_LABELS[video.language]}
                    </span>
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3.5 text-xs font-semibold text-neutral-700">
                    {video.subject}
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-3.5 text-xs font-semibold text-neutral-600">
                    {video.grade}
                  </td>

                  {/* Views */}
                  <td className="px-4 py-3.5 text-xs font-bold text-neutral-800 tabular-nums">
                    {formatViews(video.views)}
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3.5 text-xs text-neutral-500 tabular-nums">
                    {formatDuration(video.duration)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(video)}
                        className="p-2 rounded-xl text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                        title="Edit video"
                      >
                        <Pencil size={16} weight="bold" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(video.id)}
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
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
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 text-sm">
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
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center">
                    <UploadSimple size={18} weight="bold" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-neutral-950">
                    {editingId ? "Edit Video Details" : "Upload New Educational Video"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
                {/* Title Inputs */}
                <div>
                  <label className="block text-neutral-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction to Fractions"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-normal text-neutral-900 focus:outline-none focus:border-coral-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-600 mb-1">Title in Hindi (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. भिन्न का परिचय"
                      value={titleHi}
                      onChange={(e) => setTitleHi(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-normal text-neutral-900 focus:outline-none focus:border-coral-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1">Title in Kannada (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ಭಿನ್ನರಾಶಿಗಳ ಪರಿಚಯ"
                      value={titleKn}
                      onChange={(e) => setTitleKn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-normal text-neutral-900 focus:outline-none focus:border-coral-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-neutral-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Brief explanation of lesson topics..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-sm font-normal text-neutral-900 focus:outline-none focus:border-coral-500"
                  />
                </div>

                {/* Subject, Grade, Language */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-700 mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-coral-500 bg-white"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Grade Level</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-coral-500 bg-white"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-coral-500 bg-white"
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
                    <label className="block text-neutral-700 mb-1">Video MP4 URL</label>
                    <input
                      type="url"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800 focus:outline-none focus:border-coral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Duration (Seconds)</label>
                    <input
                      type="number"
                      required
                      min={30}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800 focus:outline-none focus:border-coral-500"
                    />
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div>
                  <label className="block text-neutral-700 mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    required
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800 focus:outline-none focus:border-coral-500 mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500">Pick sample:</span>
                    {SAMPLE_THUMBNAILS.map((thumb, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setThumbnailUrl(thumb)}
                        className="px-2 py-0.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-[10px]"
                      >
                        Sample {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-neutral-700 mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. math, numbers, addition"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-normal text-neutral-800 focus:outline-none focus:border-coral-500"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-coral px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-coral-500/20"
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
              className="w-full max-w-sm bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Trash size={24} weight="bold" />
              </div>
              <h4 className="font-display font-bold text-lg text-neutral-950 mb-2">Delete this video?</h4>
              <p className="text-xs text-neutral-500 mb-6">
                This action cannot be undone. The video will be removed from both the public library and the admin catalog.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteVideo(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm"
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
