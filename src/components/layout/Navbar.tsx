"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { List, X, Globe, CaretDown, ArrowRight } from "@phosphor-icons/react";
import { useLanguage } from "@/lib/language-context";
import { archivo } from "@/lib/fonts";
import type { Language } from "@/types";

/* Poster-style navbar that matches the Devi home hero: ink outlines, uppercase
   heavy type, haldi pills and a hard offset shadow. Sides line up with the
   hero's 4.6% gutters. Height stays ~56px so pages that pad for the old bar
   still clear it. */

const LANG_OPTIONS: { value: Language; label: string; native: string }[] = [
  { value: "en", label: "English", native: "EN" },
  { value: "hi", label: "Hindi", native: "हि" },
  { value: "kn", label: "Kannada", native: "ಕ" },
];

const NAV_LINKS = [
  { href: "/", label: "Home", n: "01" },
  { href: "/videos", label: "Videos", n: "02" },
  { href: "/games", label: "Games", n: "03" },
];

const HALDI = "#E2A93B";
const SINDOOR = "#C4452E";
const INK_ON_HALDI = "#3A2420";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const currentLang = LANG_OPTIONS.find((l) => l.value === language);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 z-50 left-[max(16px,4.6vw)] right-[max(16px,4.6vw)] ${archivo.variable}`}
      >
        <div
          className="rounded-[28px] border-[1.5px] backdrop-blur-md transition-[box-shadow,background-color] duration-300"
          style={{
            borderColor: "var(--text)",
            backgroundColor: scrolled || mobileOpen
              ? "color-mix(in srgb, var(--bg) 96%, transparent)"
              : "color-mix(in srgb, var(--bg) 80%, transparent)",
            boxShadow: scrolled ? `4px 4px 0 ${HALDI}` : "0 0 0 transparent",
          }}
        >
          <div className="flex items-center justify-between gap-3 pl-3 pr-2 py-2">
            {/* Logo + wordmark */}
            <Link href="/" className="group flex items-center gap-2 shrink-0" aria-label="Collective Consciousness, home">
              <span
                className="grid place-items-center w-10 h-10 rounded-full border-[1.5px] overflow-hidden transition-transform duration-300 group-hover:-rotate-12"
                style={{ borderColor: "var(--text)", backgroundColor: "#FFFBF3" }}
              >
                <Image src="/CCLOGOONLY.png" alt="" width={36} height={36} className="object-contain w-8 h-8" priority />
              </span>
              <span
                className="leading-[0.92] uppercase tracking-[-0.02em] text-[13px] sm:text-[15px]"
                style={{ fontFamily: "var(--font-archivo), 'Arial Black', sans-serif", color: "var(--text)" }}
              >
                Collective
                <br />
                <span style={{ color: SINDOOR }}>Consciousness</span>
              </span>
            </Link>

            {/* Desktop links: numbered like the poster's index pill */}
            <nav aria-label="Main" className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative inline-flex items-center gap-2 rounded-full pl-1 pr-4 py-1 text-[12px] font-extrabold uppercase tracking-[0.06em] transition-colors"
                    style={{
                      color: "var(--text)",
                      backgroundColor: active ? HALDI : "transparent",
                      boxShadow: active ? `inset 0 0 0 1.5px var(--text)` : undefined,
                    }}
                  >
                    <span
                      className="grid place-items-center h-7 min-w-7 px-1.5 rounded-full text-[10px] border-[1.5px] transition-colors"
                      style={{
                        borderColor: "var(--text)",
                        backgroundColor: active ? "#FFFBF3" : "transparent",
                        color: active ? INK_ON_HALDI : "var(--text)",
                      }}
                    >
                      {link.n}
                    </span>
                    <span className="relative" style={{ color: active ? INK_ON_HALDI : undefined }}>
                      {link.label}
                      {!active && (
                        <span
                          aria-hidden
                          className="absolute left-0 right-0 -bottom-1 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                          style={{ backgroundColor: HALDI }}
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: language + CTA + mobile toggle */}
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setLangOpen(!langOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  aria-label={`Language: ${currentLang?.label}`}
                  className="flex items-center gap-1.5 h-10 px-3.5 rounded-full border-[1.5px] text-[12px] font-extrabold uppercase transition-colors hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)]"
                  style={{ color: "var(--text)", borderColor: "var(--text)" }}
                >
                  <Globe size={14} weight="bold" />
                  {currentLang?.native}
                  <CaretDown size={10} weight="bold" className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      role="listbox"
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-3 w-44 rounded-2xl border-[1.5px] overflow-hidden p-1.5 z-50"
                      style={{ backgroundColor: "var(--surface)", borderColor: "var(--text)", boxShadow: `4px 4px 0 ${HALDI}` }}
                    >
                      {LANG_OPTIONS.map((opt) => {
                        const on = language === opt.value;
                        return (
                          <button
                            type="button"
                            role="option"
                            aria-selected={on}
                            key={opt.value}
                            onClick={() => {
                              setLanguage(opt.value);
                              setLangOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-extrabold uppercase tracking-wide transition-colors"
                            style={on ? { backgroundColor: HALDI, color: INK_ON_HALDI } : { color: "var(--text)" }}
                          >
                            <span className="w-5">{opt.native}</span>
                            <span className="font-semibold normal-case tracking-normal opacity-70">{opt.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA: a small version of the hero's split pill */}
              <Link
                href="/videos"
                className="group hidden sm:inline-flex items-stretch h-10 text-[12px] font-extrabold uppercase tracking-[0.04em]"
              >
                <span
                  className="relative z-[1] grid place-items-center px-3.5 rounded-full border-[1.5px]"
                  style={{ borderColor: "var(--text)", backgroundColor: "#FFFBF3", color: INK_ON_HALDI }}
                >
                  Free
                </span>
                <span
                  className="-ml-4 inline-flex items-center gap-1.5 pl-6 pr-4 rounded-r-full border-[1.5px] transition-colors duration-200 group-hover:text-[#F7EFE3] group-hover:bg-[#C4452E]"
                  style={{ borderColor: "var(--text)", backgroundColor: HALDI, color: INK_ON_HALDI }}
                >
                  Start learning
                  <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className="md:hidden grid place-items-center w-10 h-10 rounded-full border-[1.5px] transition-colors"
                style={{
                  borderColor: "var(--text)",
                  color: mobileOpen ? INK_ON_HALDI : "var(--text)",
                  backgroundColor: mobileOpen ? HALDI : "transparent",
                }}
              >
                {mobileOpen ? <X size={16} weight="bold" /> : <List size={16} weight="bold" />}
              </button>
            </div>
          </div>

          {/* Mobile menu: big poster type */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="border-t-[1.5px] mx-3 pt-3 pb-4 flex flex-col gap-1" style={{ borderColor: "var(--text)" }}>
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className="flex items-baseline gap-3 px-2 py-1.5 rounded-xl uppercase text-3xl tracking-[-0.03em]"
                        style={{
                          fontFamily: "var(--font-archivo), 'Arial Black', sans-serif",
                          color: active ? SINDOOR : "var(--text)",
                        }}
                      >
                        <span className="text-[11px] font-extrabold tracking-wider" style={{ fontFamily: "inherit" }}>{link.n}</span>
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="flex items-center gap-2 mt-3 px-2">
                    {LANG_OPTIONS.map((opt) => {
                      const on = language === opt.value;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setLanguage(opt.value)}
                          aria-pressed={on}
                          className="h-9 px-3.5 rounded-full border-[1.5px] text-xs font-extrabold uppercase"
                          style={{
                            borderColor: "var(--text)",
                            backgroundColor: on ? HALDI : "transparent",
                            color: on ? INK_ON_HALDI : "var(--text)",
                          }}
                        >
                          {opt.native} <span className="font-semibold normal-case opacity-70">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <Link
                    href="/videos"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 mx-2 inline-flex items-center justify-center gap-2 h-11 rounded-full border-[1.5px] text-sm font-extrabold uppercase tracking-wide"
                    style={{ borderColor: "var(--text)", backgroundColor: HALDI, color: INK_ON_HALDI }}
                  >
                    Start learning free
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </>
  );
}
