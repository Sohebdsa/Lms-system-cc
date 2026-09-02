"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, List, X, Globe, CaretDown } from "@phosphor-icons/react";
import { useLanguage } from "@/lib/language-context";
import type { Language } from "@/types";

const LANG_OPTIONS: { value: Language; label: string; native: string }[] = [
  { value: "en", label: "English", native: "EN" },
  { value: "hi", label: "Hindi", native: "हि" },
  { value: "kn", label: "Kannada", native: "ಕ" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/videos", label: "Videos" },
  { href: "/games", label: "Games" },
];

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating pill navbar */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2"
      >
        <div className={`rounded-2xl transition-all duration-300 border ${
          scrolled
            ? "bg-white/95 border-neutral-300/80 shadow-lg backdrop-blur-md"
            : "bg-white/80 border-neutral-200/90 shadow-md backdrop-blur-md"
        }`}>
          <div className="flex items-center justify-between px-5 py-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-xl gradient-coral flex items-center justify-center shadow-md shadow-coral-500/25">
                <BookOpen size={16} weight="bold" className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold font-display text-neutral-900 tracking-tight">
                  BridgEd
                </span>
                <span className="text-[9px] text-neutral-500 tracking-widest uppercase hidden sm:block">
                  Collective Consciousness
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-xl text-sm font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: lang switcher + CTA */}
            <div className="flex items-center gap-2">
              {/* Language picker */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-all border border-neutral-200 bg-white"
                >
                  <Globe size={13} weight="bold" />
                  {LANG_OPTIONS.find((l) => l.value === language)?.native}
                  <CaretDown
                    size={10}
                    className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-38 rounded-2xl bg-white border border-neutral-200 shadow-xl overflow-hidden py-1 z-50"
                    >
                      {LANG_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setLanguage(opt.value); setLangOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left text-xs font-semibold transition-colors ${
                            language === opt.value
                              ? "text-coral-600 bg-coral-500/10"
                              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50"
                          }`}
                        >
                          <span className="font-bold w-5">{opt.native}</span>
                          <span className="text-neutral-500 font-normal">{opt.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA */}
              <Link
                href="/videos"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-coral text-xs font-bold shadow-sm shadow-coral-500/20"
              >
                <span>Start Learning</span>
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all"
              >
                {mobileOpen ? <X size={18} /> : <List size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden border-t border-neutral-200 px-4 py-3 flex flex-col gap-1"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/videos"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-4 py-2 rounded-xl btn-coral text-sm font-bold text-center text-white"
                >
                  <span>Start Learning</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Close lang dropdown */}
      {langOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
      )}
    </>
  );
}
