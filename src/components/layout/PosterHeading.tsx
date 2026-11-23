"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";

/* Section / page heading in the Devi hero's poster style:
   numbered index pill, big uppercase headline, optional ringed stamp and action link. */
export default function PosterHeading({
  index,
  eyebrow,
  title,
  accent,
  stamp,
  action,
  as = "h2",
  size = "section",
}: {
  index: string;
  eyebrow: string;
  /** Headline; `accent` (if given) is set on its own line in sindoor. */
  title: string;
  accent?: string;
  stamp?: string;
  action?: { href: string; label: string };
  as?: "h1" | "h2";
  size?: "section" | "page";
}) {
  const H = as;
  const fontSize =
    size === "page" ? "clamp(2.75rem, 8vw, 6.5rem)" : "clamp(2rem, 4.6vw, 3.75rem)";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
      <div className="relative">
        <motion.span
          data-perch=""
          data-perch-x="0.85"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="poster-eyebrow mb-4"
        >
          <b>{index}</b>
          {eyebrow}
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-fit"
        >
          <H className="font-poster" style={{ fontSize, color: "var(--ink)" }}>
            {title}
            {accent && (
              <>
                <br />
                <span style={{ color: "var(--sindoor)" }}>{accent}</span>
              </>
            )}
          </H>
          {stamp && (
            <span data-perch="" data-perch-x="0.55" className="poster-stamp absolute -top-2 left-[calc(100%+0.75rem)] hidden md:inline-block" style={{ color: "var(--ink)" }}>
              {stamp}
            </span>
          )}
        </motion.div>
        {stamp && (
          <span className="poster-stamp mt-4 md:hidden" style={{ color: "var(--ink)" }}>
            {stamp}
          </span>
        )}
      </div>
      {action && (
        <Link href={action.href} className="poster-btn-ghost self-start sm:self-auto shrink-0">
          {action.label}
          <ArrowUpRight size={14} weight="bold" />
        </Link>
      )}
    </div>
  );
}
