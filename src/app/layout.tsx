import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import SmoothScroll from "@/components/layout/SmoothScroll";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Collective Consciousness — Free Education for Every Child",
  description:
    "Collective Consciousness. Free multilingual educational videos and games in Kannada, Hindi, and English. Learn without limits.",
  keywords: ["free education India", "Kannada learning", "educational games", "Collective Consciousness"],
  authors: [{ name: "Collective Consciousness", url: "https://collectiveconsciousness.in" }],
  openGraph: {
    title: "Collective Consciousness — Free Education for Every Child",
    description: "Multilingual videos and games. No registration. Always free.",
    type: "website",
  },
};

import DotPatternBackground from "@/components/ui/DotPatternBackground";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-pro-display" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} antialiased bg-transparent text-neutral-900 font-body min-h-screen relative selection:bg-coral-500/20`}>
        <DotPatternBackground />
        <LanguageProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
