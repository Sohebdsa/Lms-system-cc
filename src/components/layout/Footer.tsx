"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, EnvelopeSimple, ArrowUpRight, Heart } from "@phosphor-icons/react";

/* Haldi-yellow poster footer, matching the Devi hero: ink outlines, uppercase
   Archivo headline, numbered links and a giant wordmark. Colours are fixed
   (not theme tokens) so the footer reads the same in light and dark mode. */

const INK = "#3A2420";
const HALDI = "#E2A93B";
const CREAM = "#FFFBF3";

const FOOTER_LINKS = [
  { href: "/", label: "Home", n: "01" },
  { href: "/videos", label: "Videos", n: "02" },
  { href: "/games", label: "Games", n: "03" },
  { href: "/admin/login", label: "Admin", n: "04" },
];

export default function Footer() {
  return (
    <footer data-perch="" data-perch-x="0.9" className="relative border-t-[1.5px] overflow-x-clip" style={{ backgroundColor: HALDI, borderColor: INK, color: INK }}>
      <div className="container-xl pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1.4fr] gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <span className="grid place-items-center w-12 h-12 rounded-full border-[1.5px]" style={{ borderColor: INK, backgroundColor: CREAM }}>
                <Image src="/CCLOGOONLY.png" alt="" width={40} height={40} className="w-9 h-9 object-contain" />
              </span>
              <span className="font-poster text-lg leading-[0.95]">
                Collective
                <br />
                Consciousness
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6 font-semibold" style={{ color: "rgba(58,36,32,0.82)" }}>
              Free multilingual education for every child in India. Kannada, Hindi and English, with no
              registration and no cost.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Societies Act 1860", "80G", "12A"].map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border-[1.5px]"
                  style={{ borderColor: INK, backgroundColor: CREAM }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer">
            <p className="text-[11px] font-extrabold uppercase tracking-widest mb-5">Platform</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-3">
                    <span
                      className="grid place-items-center w-8 h-8 rounded-full border-[1.5px] text-[10px] font-extrabold transition-colors group-hover:bg-[#3A2420] group-hover:text-[#E2A93B]"
                      style={{ borderColor: INK }}
                    >
                      {link.n}
                    </span>
                    <span className="font-poster text-xl relative">
                      {link.label}
                      <span
                        aria-hidden
                        className="absolute left-0 right-0 -bottom-0.5 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        style={{ backgroundColor: INK }}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest mb-5">Contact</p>
            <ul className="space-y-3.5 text-sm font-semibold">
              <li className="flex items-start gap-3">
                <MapPin size={16} weight="bold" className="mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  B-3, R.S. Mansion, 7/4 H.D. Deve Gowda Road,
                  <br />
                  R.T. Nagar, Bangalore - 560032
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} weight="bold" className="shrink-0" />
                <a href="tel:+919148697009" className="underline-offset-4 hover:underline">+91 91486 97009</a>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeSimple size={16} weight="bold" className="shrink-0" />
                <a href="mailto:info@collectiveconsciousness.in" className="break-all underline-offset-4 hover:underline">
                  info@collectiveconsciousness.in
                </a>
              </li>
            </ul>
            <a
              href="https://collectiveconsciousness.in/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-full border-[1.5px] text-[13px] font-extrabold uppercase tracking-wider transition-colors hover:bg-[#C4452E] hover:border-[#C4452E]"
              style={{ backgroundColor: INK, borderColor: INK, color: "#F7EFE3" }}
            >
              <Heart size={14} weight="fill" />
              Support the mission
              <ArrowUpRight size={14} weight="bold" />
            </a>
          </div>
        </div>

        {/* Giant wordmark */}
        <p
          aria-hidden
          className="font-poster mt-16 select-none whitespace-nowrap leading-[0.82]"
          style={{ fontSize: "clamp(2.6rem, 9.6vw, 10rem)", color: INK }}
        >
          Learn ↘ Play<span style={{ color: "#C4452E" }}>*</span>
        </p>

        {/* Bottom */}
        <div className="mt-8 pt-5 border-t-[1.5px] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-extrabold uppercase tracking-wider" style={{ borderColor: INK }}>
          <p>&copy; {new Date().getFullYear()} Collective Consciousness. All rights reserved.</p>
          <a href="https://collectiveconsciousness.in" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            collectiveconsciousness.in
          </a>
        </div>
      </div>
    </footer>
  );
}
