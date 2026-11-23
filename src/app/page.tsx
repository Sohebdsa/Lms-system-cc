"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, GameController, Globe, ShieldCheck, ArrowUpRight, Heart } from "@phosphor-icons/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PosterHeading from "@/components/layout/PosterHeading";
import VideoCard from "@/components/video/VideoCard";
import GameCard from "@/components/games/GameCard";
import DeviHero from "@/components/home/DeviHero";
import { VIDEOS, GAMES } from "@/lib/data";

// ─── Marquee data
const MARQUEE_ITEMS = [
  "Kannada", "Hindi", "English", "Free Forever", "No Registration",
  "12+ Videos", "5 Games", "Open Access", "For Every Child", "India",
];

// ─── Stats
const STATS = [
  { value: "12+", label: "Educational videos", icon: BookOpen },
  { value: "5", label: "Interactive games", icon: GameController },
  { value: "3", label: "Languages", icon: Globe },
  { value: "∞", label: "Free. Always.", icon: ShieldCheck },
];

// ─── Framework steps – colours rotate: Sindoor, Indigo, Haldi, Deep teal
const JOURNEY = [
  { step: "01", key: "Know", desc: "Access quality content in Kannada, Hindi, and English.", color: "#C4452E" },
  { step: "02", key: "Access", desc: "No barriers. No login. Learn instantly.", color: "#2F4A73" },
  { step: "03", key: "Empower", desc: "Build skills through videos and interactive games.", color: "#E2A93B" },
  { step: "04", key: "Champion", desc: "Help bridge India's education gap together.", color: "#3F6E68" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  const featured = VIDEOS.slice(0, 6);
  const featuredGames = GAMES.slice(0, 3);

  return (
    <div className="min-h-screen relative z-0" style={{ color: "var(--ink)" }}>
      <Navbar />

      {/* ═══════════════════════════ HERO – Devi poster */}
      <DeviHero />

      {/* ═══════════════════════════ MARQUEE – inverted ink strip */}
      <section
        className="py-4 overflow-hidden border-y-[1.5px]"
        style={{ backgroundColor: "var(--ink)", borderColor: "var(--ink)" }}
        aria-label="Highlights"
      >
        <div className="flex gap-10">
          {[0, 1].map((clone) => (
            <div key={clone} className="marquee-track flex gap-10 shrink-0" aria-hidden={clone === 1}>
              {MARQUEE_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className="font-poster flex items-center gap-10 whitespace-nowrap text-xl md:text-2xl"
                  style={{ color: "var(--bg)" }}
                >
                  {item}
                  <span aria-hidden style={{ color: "var(--haldi)" }}>✱</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ STATS */}
      <section id="explore" className="py-20 scroll-mt-24">
        <div className="container-xl">
          <PosterHeading index="01" eyebrow="At a glance" title="Everything here" accent="is free." stamp="No sign-up" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const lead = i === 0;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease }}
                  data-perch=""
                  className="poster-card poster-card-hover p-6 flex flex-col justify-between min-h-44"
                  style={lead ? { backgroundColor: "var(--haldi)", color: "var(--on-haldi)" } : undefined}
                >
                  <span
                    className="grid place-items-center w-10 h-10 rounded-full border-[1.5px]"
                    style={{ borderColor: lead ? "var(--on-haldi)" : "var(--ink)" }}
                  >
                    <stat.icon size={18} weight="bold" />
                  </span>
                  <div>
                    <p className="font-poster text-5xl md:text-6xl mt-6" style={{ color: lead ? "var(--on-haldi)" : "var(--sindoor)" }}>
                      {stat.value}
                    </p>
                    <p className="text-xs font-extrabold uppercase tracking-wider mt-2">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FRAMEWORK */}
      <section className="py-20 border-t-[1.5px]" style={{ borderColor: "var(--ink)" }}>
        <div className="container-xl">
          <PosterHeading index="02" eyebrow="The Collective Consciousness framework" title="From awareness" accent="to impact." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JOURNEY.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                data-perch=""
                className="poster-card poster-card-hover relative overflow-hidden p-6 pt-8"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-2" style={{ backgroundColor: step.color }} />
                <div className="flex items-center justify-between mb-8">
                  <span
                    className="grid place-items-center w-11 h-11 rounded-full border-[1.5px] text-xs font-extrabold"
                    style={{ borderColor: "var(--ink)" }}
                  >
                    {step.step}
                  </span>
                  {i < JOURNEY.length - 1 && (
                    <span aria-hidden className="hidden lg:block text-2xl font-black" style={{ color: step.color }}>→</span>
                  )}
                </div>
                <h3 className="font-poster text-3xl mb-3" style={{ color: "var(--ink)" }}>{step.key}</h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--muted)" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED VIDEOS */}
      <section className="py-20 border-t-[1.5px]" style={{ borderColor: "var(--ink)" }}>
        <div className="container-xl">
          <PosterHeading
            index="03"
            eyebrow="Multilingual library"
            title="Learn in your"
            accent="language."
            action={{ href: "/videos", label: "View all videos" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ GAMES */}
      <section className="py-20 border-t-[1.5px]" style={{ borderColor: "var(--ink)" }}>
        <div className="container-xl">
          <PosterHeading
            index="04"
            eyebrow="Interactive learning"
            title="Games that"
            accent="teach."
            action={{ href: "/games", label: "All games" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ MISSION CTA – sindoor poster */}
      <section className="pt-10 pb-24">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            data-perch=""
            data-perch-x="0.55"
            className="relative rounded-[28px] border-[1.5px] overflow-hidden px-8 py-14 md:px-16 md:py-20"
            style={{ backgroundColor: "var(--sindoor)", borderColor: "var(--ink)", boxShadow: "8px 8px 0 var(--haldi)" }}
          >
            {/* faint grid on the poster */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(247,239,227,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(247,239,227,.12) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
            <div className="relative max-w-3xl">
              <span className="poster-eyebrow mb-6" style={{ borderColor: "#F7EFE3", color: "#F7EFE3" }}>
                <b>05</b>
                Our mission
              </span>
              <h2 className="font-poster mb-6" style={{ color: "#F7EFE3", fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}>
                Education is a right,
                <br />
                <span style={{ color: "var(--haldi)" }}>not a privilege*</span>
              </h2>
              <p className="text-base md:text-lg max-w-xl mb-9 leading-relaxed font-medium" style={{ color: "rgba(247,239,227,0.88)" }}>
                Collective Consciousness is a Bangalore-based nonprofit on a mission to make quality education
                accessible to every child, in every language.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/videos" className="poster-btn" style={{ borderColor: "#3A2420" }}>
                  <BookOpen size={16} weight="bold" />
                  Start learning free
                </Link>
                <a
                  href="https://collectiveconsciousness.in/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full border-[1.5px] text-[13px] font-extrabold uppercase tracking-wider transition-colors hover:bg-[#F7EFE3] hover:text-[#C4452E]"
                  style={{ borderColor: "#F7EFE3", color: "#F7EFE3" }}
                >
                  <Heart size={14} weight="fill" />
                  Support the mission
                  <ArrowUpRight size={14} weight="bold" />
                </a>
              </div>
            </div>

            {/* Devi waving from the corner */}
            <div aria-hidden className="pointer-events-none absolute right-6 md:right-14 bottom-0 hidden md:block w-40 lg:w-52">
              <Image src="/characters/devi.png" alt="" width={205} height={530} className="w-full h-auto translate-y-[38%]" />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
