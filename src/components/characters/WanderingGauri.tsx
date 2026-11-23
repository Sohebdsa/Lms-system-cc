"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* Gauri, the house sparrow from the Aangan storyboard, lives on top of the page.
   She perches on any element marked `data-perch` (top edge by default) and, when
   tapped, flies along an arc to another perch on screen. If her perch scrolls out
   of view she follows the reader to a visible one.

   Perch options (attributes on the element):
     data-perch          marks a perch
     data-perch-x="0.8"  where along the width she sits (0..1, default 0.8)
     data-perch-y="0"    how far down from the top edge (0..1, default 0)
     data-perch-start    preferred first perch on a page

   Position is written straight to the DOM every frame (no React re-renders), so
   she stays glued to her perch while the page scrolls or cards lift on hover. */

type Frame = "stand" | "up" | "down" | "happy";
const FRAMES: { key: Frame; src: string; w: number; h: number }[] = [
  { key: "stand", src: "/characters/gauri.png", w: 262, h: 192 },
  { key: "up", src: "/characters/gauri-wingsup.png", w: 262, h: 227 },
  { key: "down", src: "/characters/gauri-flap.png", w: 255, h: 174 },
  { key: "happy", src: "/characters/gauri-happy.png", w: 257, h: 168 },
];

type Pt = { x: number; y: number };

const OFFSCREEN_GRACE_MS = 1400;

function perchPoint(el: Element): Pt {
  const r = el.getBoundingClientRect();
  const fx = parseFloat(el.getAttribute("data-perch-x") ?? "0.8");
  const fy = parseFloat(el.getAttribute("data-perch-y") ?? "0");
  // +3px so her feet overlap the outline instead of floating above it
  return { x: r.left + r.width * fx, y: r.top + r.height * fy + 3 };
}

function isUsable(el: Element, birdH: number): boolean {
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  const p = perchPoint(el);
  // whole bird must fit on screen, and not under the fixed navbar
  return p.x > 30 && p.x < innerWidth - 30 && p.y - birdH > 84 && p.y < innerHeight - 8;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function WanderingGauri() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLButtonElement>(null);
  const frameEls = useRef<Partial<Record<Frame, HTMLSpanElement | null>>>({});
  const api = useRef<{ fly: () => void; reset: () => void } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const bird = birdRef.current;
    if (!root || !bird) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 56;
    let H = W * 0.9;
    const measure = () => {
      W = innerWidth < 640 ? 46 : 58;
      H = W * 0.9;
      root.style.width = W + "px";
      root.style.height = H + "px";
    };
    measure();
    addEventListener("resize", measure);

    let mode: "hidden" | "perched" | "flying" = "hidden";
    let perch: Element | null = null;
    let target: Element | null = null;
    let from: Pt = { x: -80, y: innerHeight * 0.3 };
    let pos: Pt = { ...from };
    let t0 = 0;
    let dur = 1000;
    let lift = 120;
    let facing = 1;
    let offSince = 0;
    let lastFlap = 0;
    let flapUp = true;
    let shown: Frame = "stand";
    let hovered = false;
    let nextIdle = performance.now() + 4000;
    let lastSearch = 0;
    let raf = 0;

    const show = (f: Frame) => {
      if (f === shown) return;
      shown = f;
      for (const k of Object.keys(frameEls.current) as Frame[]) {
        const el = frameEls.current[k];
        if (el) el.style.opacity = k === f ? "1" : "0";
      }
    };
    const setFacing = (dir: number) => {
      facing = dir;
      bird.style.setProperty("--gauri-face", String(dir));
    };
    const bounce = (cls: string) => {
      bird.classList.remove("gauri-land", "gauri-hop");
      void bird.offsetWidth; // restart the animation
      bird.classList.add(cls);
    };

    const perches = () => Array.from(document.querySelectorAll("[data-perch]"));

    const pickPerch = (exclude: Element | null, prefer?: string): Element | null => {
      const usable = perches().filter((el) => el !== exclude && isUsable(el, H));
      if (prefer) {
        const p = usable.find((el) => el.hasAttribute(prefer));
        if (p) return p;
      }
      // prefer somewhere a decent distance away, so the flight reads as a flight
      const far = usable.filter((el) => {
        const p = perchPoint(el);
        return Math.hypot(p.x - pos.x, p.y - pos.y) > 140;
      });
      const pool = far.length ? far : usable;
      return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    };

    const flyTo = (el: Element | null) => {
      if (!el) return false;
      target = el;
      from = { ...pos };
      const to = perchPoint(el);
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      dur = reduce ? 0 : Math.min(1500, Math.max(650, dist * 1.4));
      lift = Math.min(180, 50 + dist * 0.3);
      setFacing(to.x >= from.x ? 1 : -1);
      t0 = performance.now();
      mode = "flying";
      root.style.opacity = "1";
      bird.setAttribute("aria-busy", "true");
      return true;
    };

    const land = () => {
      perch = target;
      target = null;
      mode = "perched";
      offSince = 0;
      show(hovered ? "happy" : "stand");
      if (!reduce) bounce("gauri-land");
      bird.removeAttribute("aria-busy");
      nextIdle = performance.now() + 3000 + Math.random() * 4000;
    };

    api.current = {
      fly: () => {
        if (mode === "flying") return;
        const next = pickPerch(perch);
        if (!flyTo(next) && perch) {
          // nowhere else on screen: a little loop and back to the same spot
          flyTo(perch);
          lift = 160;
          dur = reduce ? 0 : 1100;
        }
      },
      // after navigation: old perch is gone, find a new one on this page
      reset: () => {
        if (mode !== "flying") {
          perch = null;
          mode = "hidden";
        }
      },
    };

    const onEnter = () => {
      hovered = true;
      if (mode === "perched") show("happy");
    };
    const onLeave = () => {
      hovered = false;
      if (mode === "perched") show("stand");
    };
    bird.addEventListener("pointerenter", onEnter);
    bird.addEventListener("pointerleave", onLeave);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      if (mode === "hidden") {
        root.style.opacity = "0";
        // wait for a page with perches (checked a few times a second); fly in from the left edge
        if (now - lastSearch > 400) {
          lastSearch = now;
          const start = pickPerch(null, "data-perch-start");
          if (start) {
            pos = { x: -70, y: Math.max(120, perchPoint(start).y - 140) };
            flyTo(start);
          }
        }
      }

      if (mode === "perched" && perch) {
        if (!perch.isConnected) {
          mode = "hidden";
          return;
        }
        pos = perchPoint(perch);
        const visible = pos.y - H > 0 && pos.y < innerHeight && pos.x > 0 && pos.x < innerWidth;
        if (!visible) {
          offSince ||= now;
          if (now - offSince > OFFSCREEN_GRACE_MS) {
            // follow the reader: fly in from just off-screen to a visible perch
            const next = pickPerch(perch);
            if (next) {
              pos = {
                x: Math.min(Math.max(pos.x, -60), innerWidth + 60),
                y: pos.y < 0 ? -40 : innerHeight + 40,
              };
              flyTo(next);
            }
          }
        } else {
          offSince = 0;
          if (!reduce && !hovered && now > nextIdle) {
            // idle: hop and look the other way now and then
            setFacing(Math.random() < 0.5 ? -facing : facing);
            bounce("gauri-hop");
            nextIdle = now + 3500 + Math.random() * 5000;
          }
        }
      }

      if (mode === "flying" && target) {
        if (!target.isConnected) {
          target = pickPerch(null);
          if (!target) {
            mode = "hidden";
            return;
          }
        }
        const to = perchPoint(target); // live, so scrolling mid-flight still lands on it
        const t = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
        const e = easeInOut(t);
        const cx = (from.x + to.x) / 2;
        const cy = Math.min(from.y, to.y) - lift;
        const u = 1 - e;
        pos = {
          x: u * u * from.x + 2 * u * e * cx + e * e * to.x,
          y: u * u * from.y + 2 * u * e * cy + e * e * to.y,
        };
        if (now - lastFlap > 85) {
          flapUp = !flapUp;
          lastFlap = now;
        }
        show(flapUp ? "up" : "down");
        if (t >= 1) land();
      }

      root.style.transform = `translate3d(${(pos.x - W / 2).toFixed(1)}px, ${(pos.y - H).toFixed(1)}px, 0)`;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", measure);
      bird.removeEventListener("pointerenter", onEnter);
      bird.removeEventListener("pointerleave", onLeave);
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.reset();
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      className="fixed left-0 top-0 z-[60] pointer-events-none"
      style={{ opacity: 0, transition: "opacity .3s", willChange: "transform" }}
    >
      <style>{`
        .gauri-bird{transform:scaleX(var(--gauri-face,1));transform-origin:50% 100%;}
        .gauri-bird.gauri-land{animation:gauri-land .45s cubic-bezier(.3,1.6,.5,1);}
        .gauri-bird.gauri-hop{animation:gauri-hop .5s ease-out;}
        @keyframes gauri-land{0%{transform:scaleX(var(--gauri-face,1)) scale(1.12,.82);}55%{transform:scaleX(var(--gauri-face,1)) scale(.94,1.08);}100%{transform:scaleX(var(--gauri-face,1));}}
        @keyframes gauri-hop{0%,100%{transform:scaleX(var(--gauri-face,1)) translateY(0);}40%{transform:scaleX(var(--gauri-face,1)) translateY(-9px);}}
        @media (prefers-reduced-motion: reduce){.gauri-bird{animation:none!important;}}
      `}</style>
      <button
        ref={birdRef}
        type="button"
        onClick={() => api.current?.fly()}
        aria-label="Gauri the sparrow. Tap to make her fly to another spot."
        title="Tap me!"
        className="gauri-bird pointer-events-auto relative block w-full h-full cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ background: "none", border: 0, padding: 0, WebkitTapHighlightColor: "transparent" }}
      >
        {FRAMES.map((f) => (
          <span
            key={f.key}
            ref={(el) => {
              frameEls.current[f.key] = el;
            }}
            className="absolute inset-x-0 bottom-0 block"
            style={{ opacity: f.key === "stand" ? 1 : 0 }}
          >
            <Image src={f.src} alt="" width={f.w} height={f.h} priority className="w-full h-auto select-none" draggable={false} />
          </span>
        ))}
      </button>
    </div>
  );
}
