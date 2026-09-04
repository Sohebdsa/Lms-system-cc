"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, EnvelopeSimple, ArrowUpRight, Heart } from "@phosphor-icons/react";
import { useLanguage } from "@/lib/language-context";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/videos", label: "Videos" },
  { href: "/games", label: "Games" },
  { href: "/admin/login", label: "Admin" },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-neutral-200/80 bg-white/70 backdrop-blur-md">
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.5fr] gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/CCLOGOONLY.png"
                alt="Collective Consciousness Logo"
                width={99}
                height={36}
                className="object-contain shrink-0"
              />
              <div>
                <p className="font-display font-bold text-neutral-900 leading-none">Collective Consciousness</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs mb-5">
              Free multilingual education for every child in India. Kannada, Hindi, and English — no registration, no cost.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Societies Act 1860", "80G", "12A"].map((badge) => (
                <span key={badge} className="text-[10px] font-bold text-neutral-700 border border-neutral-200 bg-white px-2.5 py-1 rounded-lg">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Platform</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
                  >
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Contact</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-coral-500 mt-0.5 shrink-0" />
                <span className="text-xs text-neutral-600 leading-relaxed">
                  B-3, R.S. Mansion, 7/4 H.D. Deve Gowda Road,<br />
                  R.T. Nagar, Bangalore - 560032
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-coral-500 shrink-0" />
                <a href="tel:+919148697009" className="text-xs text-neutral-600 hover:text-neutral-950 transition-colors">
                  +91 91486 97009
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <EnvelopeSimple size={14} className="text-coral-500 shrink-0" />
                <a href="mailto:info@collectiveconsciousness.in" className="text-xs text-neutral-600 hover:text-neutral-950 transition-colors break-all">
                  info@collectiveconsciousness.in
                </a>
              </li>
            </ul>
            <a
              href="https://collectiveconsciousness.in/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral-500/10 border border-coral-500/20 text-coral-600 text-xs font-bold hover:bg-coral-500/15 transition-colors"
            >
              <Heart size={13} weight="fill" />
              Support the Mission
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-500">
            &copy; {new Date().getFullYear()} Collective Consciousness. All rights reserved.
          </p>
          <a
            href="https://collectiveconsciousness.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            collectiveconsciousness.in
          </a>
        </div>
      </div>
    </footer>
  );
}
