"use client";

import { motion } from "motion/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  BookOpen, GameController, ArrowRight, Globe, ShieldCheck,
  GraduationCap, CheckCircle, ArrowUpRight,
} from "@phosphor-icons/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoCard from "@/components/video/VideoCard";
import GameCard from "@/components/games/GameCard";
import { useLanguage } from "@/lib/language-context";
import { VIDEOS, GAMES } from "@/lib/data";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-[450px] h-[330px] flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 animate-spin" />
    </div>
  ),
});

// ─── Marquee data
const MARQUEE_ITEMS = [
  "Kannada", "Hindi", "English", "Free Forever", "No Registration",
  "12+ Videos", "5 Games", "Open Access", "For Every Child", "India",
];

// ─── Stats bento data
const BENTO_STATS = [
  { value: "12+", label: "Educational Videos", icon: BookOpen },
  { value: "5",   label: "Interactive Games",  icon: GameController },
  { value: "3",   label: "Languages",          icon: Globe },
  { value: "∞",   label: "Free. Always.",      icon: ShieldCheck },
];

// ─── Journey steps
const JOURNEY = [
  { step: "01", key: "KNOW",    desc: "Access quality content in Kannada, Hindi, and English", color: "coral" },
  { step: "02", key: "ACCESS",  desc: "No barriers. No login. Learn instantly.", color: "gold" },
  { step: "03", key: "EMPOWER", desc: "Build skills through videos and interactive games", color: "coral" },
  { step: "04", key: "CHAMPION",desc: "Help bridge India's education gap together", color: "gold" },
];

export default function HomePage() {
  const { t } = useLanguage();
  const featured = VIDEOS.slice(0, 6);
  const featuredGames = GAMES.slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent relative z-0 text-neutral-900">
      <Navbar />

      {/* ═══════════════════════════════════════════ HERO */}
      <section className="relative min-h-[92dvh] flex items-center overflow-hidden">
        <div className="container-xl relative pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_470px] gap-12 items-center">

            {/* ── Left content */}
            <div className="max-w-2xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200/90 bg-white/80 backdrop-blur-sm mb-7 shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[rgb(255_78_41)] ping-slow" />
                <span className="text-xs font-semibold text-neutral-700 tracking-wide">
                  Collective Consciousness · Bangalore
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-[-0.03em] mb-6 text-neutral-950"
              >
                <span>Learning</span>
                <br />
                <span className="text-[rgb(255_78_41)]">without</span>
                <br />
                <span>borders.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-lg mb-9"
              >
                Free multilingual education for India's children — videos and games in
                <span className="text-neutral-900 font-semibold"> Kannada, Hindi,</span> and
                <span className="text-neutral-900 font-semibold"> English</span>.
                No registration. No barriers.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Link
                  href="/videos"
                  className="group btn-coral inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold shadow-md shadow-coral-500/20"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} weight="bold" />
                    Browse Videos
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/games"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold border border-neutral-300/80 bg-white/90 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-400 transition-all shadow-xs"
                >
                  <GameController size={16} weight="bold" />
                  Play Games
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-5 flex-wrap"
              >
                {[
                  { icon: CheckCircle, text: "No registration required" },
                  { icon: Globe, text: "3 languages" },
                  { icon: ShieldCheck, text: "Always free" },
                ].map((item) => (
                  <span key={item.text} className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                    <item.icon size={14} className="text-[rgb(255_78_41)]" />
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* ── Right: 3D Scene */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col items-center justify-center relative min-h-[440px]"
            >
              {/* 3D Scene */}
              <div className="relative z-10 w-full flex items-center justify-center">
                <HeroScene />
              </div>

              {/* Floating UI cards */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 left-0 z-20 w-44 rounded-2xl bg-white/90 border border-neutral-200/80 p-3.5 shadow-md backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-coral-500/10 flex items-center justify-center">
                    <BookOpen size={13} className="text-[rgb(255_78_41)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-900">Now Playing</p>
                    <p className="text-[9px] text-neutral-500">Grade 1 · Maths</p>
                  </div>
                </div>
                <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
                  <motion.div
                    animate={{ width: ["30%", "75%", "30%"] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="h-full bg-[rgb(255_78_41)] rounded-full"
                  />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-6 right-0 z-20 w-40 rounded-2xl bg-white/90 border border-neutral-200/80 p-3 shadow-md backdrop-blur-md"
              >
                <p className="text-[9px] font-bold text-neutral-800 mb-2">Matched!</p>
                {["ಸೇಬು = Apple", "आम = Mango"].map((pair) => (
                  <div key={pair} className="flex items-center gap-1.5 py-1">
                    <CheckCircle size={11} className="text-emerald-500 shrink-0" />
                    <span className="text-[10px] font-medium text-neutral-700">{pair}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ MARQUEE */}
      <section className="py-4 border-y border-neutral-200/70 bg-white/70 backdrop-blur-sm overflow-hidden">
        <div className="flex gap-8">
          {[0, 1].map((clone) => (
            <div key={clone} className="marquee-track flex gap-8 shrink-0">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="flex items-center gap-3 whitespace-nowrap text-xs font-bold text-neutral-600 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[rgb(255_78_41)]" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ BENTO STATS */}
      <section className="py-20">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {BENTO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm p-6 overflow-hidden group hover:border-neutral-300 hover:shadow-md transition-all duration-300 shadow-xs"
              >
                <stat.icon size={22} className="text-[rgb(255_78_41)] mb-4" />
                <p className="font-display text-4xl font-extrabold text-neutral-900 tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ JOURNEY */}
      <section className="py-20 border-t border-neutral-200/70 bg-white/40 backdrop-blur-xs">
        <div className="container-xl">
          <div className="max-w-md mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-[rgb(255_78_41)] uppercase tracking-widest mb-2"
            >
              The Collective Consciousness Framework
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display text-3xl md:text-4xl font-extrabold text-neutral-950"
            >
              From awareness to impact.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JOURNEY.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl border border-neutral-200/80 bg-white/85 backdrop-blur-sm p-6 group hover:border-neutral-300 hover:shadow-md transition-all duration-300 shadow-xs"
              >
                <span className={`text-xs font-bold tracking-widest mb-3 block ${
                  step.color === "coral" ? "text-[rgb(255_78_41)]" : "text-amber-600"
                }`}>
                  {step.step}
                </span>
                <h3 className="font-display text-xl font-extrabold text-neutral-900 mb-2">{step.key}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ FEATURED VIDEOS */}
      <section className="py-20 border-t border-neutral-200/70">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-10">
            <div className="max-w-lg">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold text-[rgb(255_78_41)] uppercase tracking-widest mb-2"
              >
                Multilingual Library
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-display text-3xl md:text-4xl font-extrabold text-neutral-950"
              >
                Learn in your language.
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                href="/videos"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-neutral-700 hover:text-neutral-950 transition-colors group"
              >
                View all videos
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ GAMES */}
      <section className="py-20 border-t border-neutral-200/70 bg-white/40 backdrop-blur-xs">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2"
              >
                Interactive Learning
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-display text-3xl md:text-4xl font-extrabold text-neutral-950"
              >
                Games that teach.
              </motion.h2>
            </div>
            <Link href="/games" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-neutral-700 hover:text-neutral-950 transition-colors group">
              All games <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredGames.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ MISSION CTA */}
      <section className="py-20 border-t border-neutral-200/70">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden border border-neutral-200/90 bg-white/90 p-10 md:p-14 text-center shadow-lg backdrop-blur-md"
          >
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-coral mb-6 shadow-md shadow-coral-500/25">
                <GraduationCap size={24} weight="bold" className="text-white" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 text-neutral-950">
                Education is a right,
                <br />
                <span className="text-[rgb(255_78_41)]">not a privilege.</span>
              </h2>
              <p className="text-neutral-600 text-base max-w-lg mx-auto mb-8 leading-relaxed font-medium">
                Collective Consciousness is a Bangalore-based nonprofit on a mission to make
                quality education accessible to every child, in every language.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/videos" className="btn-coral inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold shadow-md shadow-coral-500/20">
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} weight="bold" />
                    Start Learning Free
                  </span>
                </Link>
                <a
                  href="https://collectiveconsciousness.in/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 transition-all shadow-xs"
                >
                  Support the Mission
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
