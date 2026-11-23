"use client"

import * as React from "react"
import Link from "next/link"
import { archivo } from "@/lib/fonts"
import { aim, approach, blink, flowerPath, pose, room } from "@/components/ui/mascot-portfolio-hero"

/* Home hero in the style of MascotPortfolioHero, rebuilt around Devi from the
   "Devi / Aangan" storyboard: twin plaits with red ribbons, haldi kurta with
   sindoor motifs. The head-turn parallax, blink and idle look-around reuse the
   maths exported from the ui component; only the figure and copy differ. */

const CW = 600
const CH = 720
const ROOM = room()
const FLOWER = flowerPath()

const SKIN = "#C98157"
const HAIR = "#2B1A14"
const KURTA = "#EDB43E"
const SINDOOR = "#C4452E"

/** Height of the fixed navbar plus its top gap, so the poster starts below it. */
const NAV_OFFSET = "88px"

const SERVICES = [
  { label: "Watch videos", href: "/videos" },
  { label: "Play games", href: "/games" },
  { label: "Show me around", href: "#explore" },
]

const GREETINGS = [
  "Namaste! I'm Devi. Tap me again!",
  "Our videos speak Kannada, Hindi and English.",
  "Want to play? Try “Play games” down below.",
  "Everything here is free. No sign-up!",
  "Hehe, that tickles!",
]


const CSS = `
.dvh-root{position:relative;width:100%;overflow:hidden;isolation:isolate;background:var(--bg);color:var(--text);container:dvh / size;font-family:var(--font-sf-text),system-ui,sans-serif;-webkit-font-smoothing:antialiased;--dvh-accent:#E2A93B;--dvh-ink:var(--text);--dvh-paper:var(--bg);--dvh-card:var(--surface);--dvh-display:var(--font-archivo),"Arial Black",system-ui,sans-serif;}
.dvh-room{position:absolute;inset:0;width:100%;height:100%;display:block;color:var(--dvh-ink);pointer-events:none;}
.dvh-room line,.dvh-room path{vector-effect:non-scaling-stroke;}
/* The stage fills the hero. 1u is 1% of the largest 16:9 canvas that fits; --ex/--ey are the spare
   width/height beyond it. --L pins the outer gutters to 4.6% of the
   real width (same as the navbar), so wide screens spread out instead of boxing the poster in the middle. */
.dvh-stage{position:absolute;inset:0;container:dvhs / size;--u:min(1cqw,1.7778cqh);--ex:calc((100cqw - 100*var(--u)) / 2);--ey:calc((100cqh - 56.25*var(--u)) / 2);--L:calc((1cqw - var(--u)) * 4.6);}

.dvh-top{position:absolute;left:calc(4.6*var(--u) + var(--L));right:calc(4.6*var(--u) + var(--L));top:calc(var(--ey) + 1.7*var(--u));display:grid;grid-template-columns:auto auto 1fr auto auto;align-items:center;column-gap:calc(2.4*var(--u));font-size:calc(1.05*var(--u));font-weight:800;line-height:1.1;text-transform:uppercase;letter-spacing:.02em;}
.dvh-index{display:inline-flex;align-items:center;gap:.9em;border:calc(.12*var(--u)) solid var(--dvh-ink);border-radius:999px;padding:.12em .9em .12em .12em;font-size:.72em;}
.dvh-index b{background:var(--dvh-accent);color:#3A2420;border-radius:999px;padding:.3em 1.2em;font-weight:800;}
.dvh-tagline{font-size:1.18em;font-weight:900;margin-left:calc(1*var(--u));}
.dvh-brace{grid-column:4;font-size:1.3em;font-weight:700;letter-spacing:.04em;margin-right:calc(2.6*var(--u));}
.dvh-reel{grid-column:5;display:flex;align-items:center;gap:.8em;font-size:.8em;text-align:right;}
.dvh-reel i{display:block;width:1.9em;height:1.9em;border-radius:50%;background:${SINDOOR};border:calc(.12*var(--u)) solid var(--dvh-ink);flex:none;}

.dvh-h1{position:absolute;left:calc(8.8*var(--u) + var(--L));top:calc(var(--ey) + 8.7*var(--u));margin:0;font-family:var(--dvh-display);font-weight:400;font-size:calc(6.5*var(--u));line-height:.93;letter-spacing:-.04em;text-transform:uppercase;color:var(--dvh-ink);}
.dvh-line{display:block;width:max-content;white-space:nowrap;position:relative;}
.dvh-line-2{color:${SINDOOR};}
.dvh-ch{display:inline-block;transition:transform .35s cubic-bezier(.3,1.6,.5,1),color .2s;}
.dvh-ch:hover{transform:translateY(-.08em) rotate(-4deg);color:var(--dvh-accent);}
.dvh-arrow{display:inline-block;width:.6em;height:.6em;margin:0 .06em 0 .1em;vertical-align:-.02em;}
.dvh-arrow path{stroke:currentColor;stroke-width:15;fill:none;stroke-linecap:square;}
.dvh-badge{position:absolute;top:-.02em;left:calc(100% + .55em);font-family:var(--font-sf-text),system-ui,sans-serif;font-size:.2em;font-weight:800;letter-spacing:0;line-height:1;text-transform:none;border:calc(.13*var(--u)) solid var(--dvh-ink);border-radius:50%;padding:.75em 1.15em;transform:rotate(-9deg);transition:background .25s,transform .4s cubic-bezier(.3,1.6,.5,1);cursor:default;white-space:nowrap;}
.dvh-badge:hover{background:var(--dvh-accent);color:#3A2420;transform:rotate(6deg) scale(1.08);}
.dvh-swash{position:relative;display:inline-block;}
.dvh-swash svg{position:absolute;left:-.95em;top:.3em;width:2.55em;height:.72em;overflow:visible;pointer-events:none;}
.dvh-swash path{fill:none;stroke:var(--dvh-ink);stroke-width:calc(.2*var(--u));stroke-linecap:round;stroke-dasharray:1;animation:dvh-draw 1.6s .5s cubic-bezier(.6,0,.2,1) both;}
.dvh-h1:hover .dvh-swash path{animation:dvh-draw 1.1s cubic-bezier(.6,0,.2,1) both;}
.dvh-l4{font-size:1.2em;letter-spacing:-.02em;margin-top:.04em;}
.dvh-vtag{display:inline-flex;flex-direction:column;align-items:stretch;vertical-align:-.02em;margin:0 .1em 0 .06em;width:.2em;}
.dvh-vtag span{display:block;background:var(--dvh-ink);color:var(--dvh-paper);writing-mode:vertical-rl;font-family:var(--font-sf-text),system-ui,sans-serif;font-size:.105em;font-weight:800;letter-spacing:.12em;padding:.55em 0;text-align:center;}
.dvh-vtag i{display:block;height:.34em;background:repeating-linear-gradient(to bottom,var(--dvh-ink) 0 .02em,transparent .02em .045em);}
.dvh-bracket{position:relative;display:inline-block;padding:0 .08em;}
.dvh-bracket svg{position:absolute;left:-.02em;top:-.1em;width:calc(100% + .04em);height:calc(100% + .22em);overflow:visible;}
.dvh-bracket path{fill:none;stroke:var(--dvh-ink);stroke-width:calc(.62*var(--u));transition:transform .45s cubic-bezier(.3,1.6,.5,1);}
.dvh-bracket:hover .dvh-arc-t{transform:translateY(-10px);}
.dvh-bracket:hover .dvh-arc-b{transform:translateY(10px);}
.dvh-star{display:inline-block;font-size:.66em;vertical-align:.5em;margin-left:.02em;color:${SINDOOR};transition:transform .6s cubic-bezier(.3,1.6,.5,1);}
.dvh-l4:hover .dvh-star{transform:rotate(180deg) scale(1.2);}

.dvh-pill{position:absolute;left:calc(8.8*var(--u) + var(--L));top:calc(var(--ey) + 41*var(--u));display:flex;align-items:stretch;font-size:calc(1.72*var(--u));font-weight:800;line-height:1;}
.dvh-pill-a{position:relative;z-index:1;background:var(--dvh-card);color:var(--dvh-ink);border:calc(.16*var(--u)) solid var(--dvh-ink);border-radius:999px;padding:.72em 1.25em;}
.dvh-pill-b{display:inline-flex;align-items:center;gap:.5em;margin-left:-1.4em;padding:.72em 3.4em .72em 3.1em;background:var(--dvh-accent);color:#3A2420;border:calc(.16*var(--u)) solid var(--dvh-ink);border-radius:0 999px 999px 0;text-decoration:none;transition:background .25s,color .25s,padding .35s cubic-bezier(.3,1.4,.5,1);}
.dvh-pill-b em{font-style:normal;display:inline-block;width:0;overflow:hidden;opacity:0;transition:width .35s,opacity .25s;}
.dvh-pill-b:hover,.dvh-pill-b:focus-visible{background:${SINDOOR};color:#F7EFE3;padding-right:2.4em;outline:none;}
.dvh-pill-b:hover em,.dvh-pill-b:focus-visible em{width:1em;opacity:1;}

.dvh-flower{position:absolute;left:calc(35.4*var(--u) + var(--L));top:calc(var(--ey) + 36*var(--u));width:calc(7.4*var(--u));aspect-ratio:1;animation:dvh-spin 22s linear infinite;}
.dvh-flower svg{display:block;width:100%;height:100%;overflow:visible;transition:transform .5s cubic-bezier(.3,1.8,.5,1);}
.dvh-flower:hover svg{transform:scale(1.18) rotate(40deg);}
.dvh-flower path{fill:var(--dvh-accent);stroke:var(--dvh-ink);stroke-width:2.6;stroke-linejoin:round;}
.dvh-flower circle{fill:${SINDOOR};stroke:var(--dvh-ink);stroke-width:2;}
.dvh-curl{position:absolute;left:calc(43.2*var(--u) + var(--L));top:calc(var(--ey) + 29.5*var(--u));width:calc(5.6*var(--u));aspect-ratio:1;overflow:visible;pointer-events:none;}
.dvh-curl path{fill:none;stroke:var(--dvh-ink);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;animation:dvh-draw 1.4s 1s cubic-bezier(.6,0,.2,1) both;}

.dvh-services{position:absolute;left:calc(8.8*var(--u) + var(--L));bottom:calc(var(--ey) + 2.6*var(--u));display:flex;gap:calc(4*var(--u));margin:0;padding:0;list-style:none;font-size:calc(1.3*var(--u));font-weight:800;}
.dvh-services li{position:relative;padding-bottom:.25em;}
.dvh-services a{color:inherit;text-decoration:none;}
.dvh-services a::before{content:"→ ";color:${SINDOOR};}
.dvh-services li::after{content:"";position:absolute;left:0;right:0;bottom:0;height:.18em;background:var(--dvh-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.6,0,.2,1);}
.dvh-services li:hover::after,.dvh-services li:focus-within::after{transform:scaleX(1);}

.dvh-rule{position:absolute;width:0;border-left:calc(.1*var(--u)) solid var(--dvh-ink);}
.dvh-rule::after{content:"";position:absolute;bottom:0;left:-calc(.1*var(--u));width:calc(1.1*var(--u));border-top:calc(.1*var(--u)) solid var(--dvh-ink);transform:rotate(28deg);transform-origin:left;}
.dvh-rule-l{left:calc(3.7*var(--u) + var(--L));top:calc(var(--ey) + 11.8*var(--u));height:calc(7.3*var(--u));}
.dvh-rule-r{right:calc(5.2*var(--u) + var(--L));top:calc(var(--ey) + 37*var(--u));height:calc(7.3*var(--u));}

.dvh-char{position:absolute;right:calc(4*var(--u) + var(--L));bottom:calc(-.7*var(--u));width:calc(40.5*var(--u));aspect-ratio:600/720;padding:0;margin:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;border-radius:40% 40% 8% 8%;}
.dvh-char:focus-visible{outline:calc(.2*var(--u)) dashed var(--dvh-ink);outline-offset:calc(.4*var(--u));}
.dvh-char svg{display:block;width:100%;height:100%;overflow:visible;}
.dvh-ribbon{transform-box:fill-box;transform-origin:50% 50%;}
.dvh-happy .dvh-ribbon{animation:dvh-wiggle .9s cubic-bezier(.3,1.6,.5,1);}
.dvh-bubble{position:absolute;left:52%;top:-3%;max-width:50%;background:var(--dvh-card);color:var(--dvh-ink);border:calc(.16*var(--u)) solid var(--dvh-ink);border-radius:1.4em 1.4em 1.4em .2em;padding:.8em 1.1em;font-size:calc(1.3*var(--u));font-weight:800;line-height:1.25;text-align:left;box-shadow:calc(.35*var(--u)) calc(.35*var(--u)) 0 var(--dvh-accent);transform-origin:0 100%;transform:scale(0) rotate(-8deg);opacity:0;transition:transform .45s cubic-bezier(.3,1.6,.5,1),opacity .2s;pointer-events:none;}
.dvh-bubble[data-on="true"]{transform:scale(1) rotate(-4deg);opacity:1;}


@keyframes dvh-draw{from{stroke-dashoffset:1;}to{stroke-dashoffset:0;}}
@keyframes dvh-spin{to{transform:rotate(360deg);}}
@keyframes dvh-wiggle{0%{transform:rotate(0);}25%{transform:rotate(-16deg);}55%{transform:rotate(10deg);}80%{transform:rotate(-4deg);}100%{transform:rotate(0);}}
@keyframes dvh-hover{0%,100%{transform:translate(0,0);}50%{transform:translate(-calc(.6*var(--u)),-calc(1.4*var(--u)));}}

@container dvh (orientation: portrait){
.dvh-stage{inset:auto;left:50%;top:0;transform:translateX(-50%);width:min(100cqw,56.25cqh);height:100cqh;--u:1cqw;--ex:0px;--ey:0px;--L:0px;}
.dvh-top{top:4cqw;left:6%;right:6%;grid-template-columns:auto 1fr auto;font-size:2.5cqw;}
.dvh-tagline,.dvh-brace{display:none;}
.dvh-reel{grid-column:3;}
.dvh-h1{left:7%;top:15cqw;font-size:11.4cqw;}
.dvh-badge{left:auto;right:0;top:5.6em;font-size:.2em;}
.dvh-pill{left:7%;top:68cqw;font-size:3.5cqw;}
.dvh-flower{left:auto;right:6%;top:64cqw;width:13%;}
.dvh-curl{left:auto;right:4%;top:42cqw;width:11%;}
.dvh-services{left:7%;right:7%;bottom:auto;top:82cqw;flex-wrap:wrap;gap:1.6cqw 5cqw;font-size:3cqw;}
.dvh-rule-l{left:3%;top:20cqw;height:12cqw;}
.dvh-rule-r{right:auto;left:95%;top:auto;bottom:40cqw;height:12cqw;}
.dvh-char{right:auto;left:6%;width:88%;bottom:-.6%;}
.dvh-bubble{font-size:3cqw;left:50%;top:-2%;max-width:48%;}
}

@media (prefers-reduced-motion: reduce){
.dvh-root *,.dvh-root *::after{animation:none!important;transition:none!important;}
}
`

type Layers = Partial<
  Record<
    "body" | "head" | "earL" | "earR" | "hair" | "ribbons" | "blush" | "face" | "nose" | "eyes" | "brows",
    SVGGElement | null
  >
>

/** One plait: overlapping lobes that drift outward as they fall over the shoulder. */
function Plait({ side, id }: { side: "l" | "r"; id: string }) {
  const s = side === "l" ? -1 : 1
  const lobes = Array.from({ length: 8 }, (_, i) => {
    const cx = 300 + s * (150 + i * 2.4)
    const cy = 432 + i * 31
    const rot = (i % 2 ? 1 : -1) * 24 * s
    const r = 25 - i * 1.1
    return (
      <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.88} transform={`rotate(${rot} ${cx} ${cy})`} fill={HAIR} stroke="#120906" strokeOpacity="0.55" strokeWidth="3" />
    )
  })
  const tipX = 300 + s * 170
  const bowX = 300 + s * 154
  const bowY = 500
  return (
    <g>
      {lobes}
      {/* tuft at the end */}
      <path d={`M${tipX - 12} 668 Q${tipX} 700 ${tipX + 12} 668 Z`} fill={HAIR} />
      {/* Red ribbon bow, wiggles when Devi is poked */}
      <g data-ribbon={id} className="dvh-ribbon">
        <path d={`M${bowX} ${bowY} C${bowX - 40} ${bowY - 34} ${bowX - 46} ${bowY + 20} ${bowX} ${bowY} Z`} fill={SINDOOR} stroke="#7d1f12" strokeWidth="3" />
        <path d={`M${bowX} ${bowY} C${bowX + 40} ${bowY - 34} ${bowX + 46} ${bowY + 20} ${bowX} ${bowY} Z`} fill={SINDOOR} stroke="#7d1f12" strokeWidth="3" />
        <path d={`M${bowX - 4} ${bowY + 4} L${bowX - 18} ${bowY + 40} L${bowX - 6} ${bowY + 34} Z M${bowX + 4} ${bowY + 4} L${bowX + 18} ${bowY + 40} L${bowX + 6} ${bowY + 34} Z`} fill="#a8321f" />
        <circle cx={bowX} cy={bowY} r="9" fill="#a8321f" stroke="#7d1f12" strokeWidth="2.5" />
      </g>
    </g>
  )
}

export default function DeviHero() {
  const uid = React.useId().replace(/:/g, "")
  const id = (n: string) => n + uid
  const u = (n: string) => "url(#" + id(n) + ")"

  const rootRef = React.useRef<HTMLDivElement>(null)
  const charRef = React.useRef<HTMLButtonElement>(null)
  // A plain mutable bag (not a ref) so callback refs can fill it without
  // tripping the react-hooks/refs lint rule.
  const [layers] = React.useState<Layers>(() => ({}))
  const set = (k: keyof Layers) => (el: SVGGElement | null) => {
    layers[k] = el
  }

  const [happy, setHappy] = React.useState(false)
  const [talking, setTalking] = React.useState(false)
  const [said, setSaid] = React.useState(0)
  const timer = React.useRef<number | undefined>(undefined)

  const poke = () => {
    setSaid((n) => (n + 1) % GREETINGS.length)
    setHappy(true)
    setTalking(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setHappy(false)
      setTalking(false)
    }, 2600)
  }

  // Devi says hello once on arrival, so visitors know she can be tapped.
  React.useEffect(() => {
    const a = window.setTimeout(() => setTalking(true), 1200)
    const b = window.setTimeout(() => setTalking(false), 4600)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
      window.clearTimeout(timer.current)
    }
  }, [])


  /* Gaze loop — same approach as MascotPortfolioHero: write transforms straight
     to the SVG layers instead of through React state. */
  React.useEffect(() => {
    const root = rootRef.current
    const char = charRef.current
    if (!root || !char) return

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    let still = mq.matches
    const onMq = () => (still = mq.matches)
    mq.addEventListener("change", onMq)

    let px = 0
    let py = 0
    let lastMove = -1e9
    let gx = 0
    let gy = 0
    let near = 0
    // Clock starts on the first frame.
    let prev = -1
    let nextBlink = Infinity
    let blinkAt = -1e9
    let raf = 0
    let visible = true

    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      lastMove = performance.now()
    }
    const onLeave = () => (lastMove = -1e9)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)

    const tr = (dx: number, dy: number) => "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")"
    const L = layers

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (prev < 0) {
        prev = now
        nextBlink = now + 1800
      }
      if (!visible) return
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now

      const r = char.getBoundingClientRect()
      const cx = r.left + r.width * 0.5
      const cy = r.top + r.height * 0.48
      let tx = 0
      let ty = 0
      let tn = 0
      if (now - lastMove <= 3500) {
        const reach = Math.max(innerWidth, innerHeight)
        ;[tx, ty] = aim(px, py, cx, cy, reach * 0.3, reach * 0.26)
        tn = Math.max(0, 1 - Math.hypot(px - cx, py - cy) / (r.width * 0.45))
      } else if (!still) {
        const t = now / 1000
        tx = Math.sin(t * 0.45) * 0.55 + Math.sin(t * 1.1) * 0.1
        ty = Math.sin(t * 0.31 + 1) * 0.25
      }

      const rate = still ? 30 : 7
      gx = approach(gx, tx, dt, rate)
      gy = approach(gy, ty, dt, rate)
      near = approach(near, tn, dt, 8)
      const p = pose(gx, gy, near)
      const breathe = still ? 0 : Math.sin(now / 620) * 1.6

      if (!still && now > nextBlink) {
        blinkAt = now
        nextBlink = now + (Math.random() < 0.2 ? 260 : 2200 + Math.random() * 3200)
      }
      const open = still ? 1 : blink((now - blinkAt) / 1000)

      L.body?.setAttribute("transform", tr(p.body.dx, p.body.dy + breathe * 0.4))
      L.head?.setAttribute("transform", tr(p.head.dx, p.head.dy + breathe) + " rotate(" + p.head.rot.toFixed(2) + " 300 560)")
      L.earL?.setAttribute("transform", tr(p.ears.dx, p.ears.dy) + " translate(138 380) scale(" + p.ears.lead.toFixed(3) + " 1) translate(-138 -380)")
      L.earR?.setAttribute("transform", tr(p.ears.dx, p.ears.dy) + " translate(462 380) scale(" + p.ears.trail.toFixed(3) + " 1) translate(-462 -380)")
      L.hair?.setAttribute("transform", tr(p.beanie.dx, p.beanie.dy))
      // Plaits hang from behind the ears, so they swing the opposite way, like the ears.
      L.ribbons?.setAttribute("transform", tr(-p.tag.dx * 0.6, 0))
      L.blush?.setAttribute("transform", tr(p.blush.dx, p.blush.dy))
      L.face?.setAttribute("transform", tr(p.face.dx, p.face.dy))
      L.nose?.setAttribute("transform", tr(p.nose.dx, p.nose.dy))
      L.brows?.setAttribute("transform", tr(p.brows.dx, p.brows.dy))
      L.eyes?.setAttribute(
        "transform",
        tr(p.eyes.dx, p.eyes.dy) + " translate(300 350) scale(" + p.eyes.scale.toFixed(3) + " " + (p.eyes.scale * open).toFixed(3) + ") translate(-300 -350)",
      )
    }
    raf = requestAnimationFrame(frame)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      prev = performance.now()
    })
    io.observe(root)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      mq.removeEventListener("change", onMq)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
    }
  }, [layers])

  const chars = (s: string) =>
    Array.from(s).map((c, i) => (
      <span key={i} className="dvh-ch">
        {c === " " ? " " : c}
      </span>
    ))

  return (
    <section style={{ paddingTop: NAV_OFFSET }}>
      <div
        ref={rootRef}
        className={"dvh-root " + archivo.variable}
        style={{ height: `calc(100svh - ${NAV_OFFSET})`, minHeight: "480px" }}
      >
        <style>{CSS}</style>

        <svg className="dvh-room" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.12">
            {ROOM.back.map((s, i) => (
              <line key={"b" + i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
            ))}
            {ROOM.rays.map((s, i) => (
              <line key={"r" + i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
            ))}
            {ROOM.depth.map((d, i) => (
              <path key={"d" + i} d={d} />
            ))}
          </g>
        </svg>

        <div className="dvh-stage">
          <div className="dvh-top">
            <span className="dvh-index">
              <b>Free</b>
              Learning for every child
            </span>
            <span className="dvh-tagline">Kannada · Hindi · English</span>
            <span className="dvh-brace">{"{"}Videos/Games{"}"}</span>
            <span className="dvh-reel">
              <i aria-hidden="true" />
              <span>
                Collective Consciousness
                <br />
                Bangalore, India
              </span>
            </span>
          </div>

          <span className="dvh-rule dvh-rule-l" aria-hidden="true" />
          <span className="dvh-rule dvh-rule-r" aria-hidden="true" />

          <h1 className="dvh-h1" aria-label="Learn, play, without borders. Grow up together.">
            <span className="dvh-line" aria-hidden="true">
              {chars("Learn")}
              <svg className="dvh-arrow" viewBox="0 0 100 100">
                <path d="M14 14 L84 84 M84 30 V84 H30" />
              </svg>
              {chars("Play")}
              <span className="dvh-badge" data-perch="" data-perch-start="" data-perch-x="0.62">Free forever</span>
            </span>
            <span className="dvh-line dvh-line-2" aria-hidden="true">
              {chars("Without")}
            </span>
            <span className="dvh-line" aria-hidden="true">
              {chars("Border")}
              <span className="dvh-swash">
                <span className="dvh-ch">S</span>
                <svg viewBox="0 0 255 72" preserveAspectRatio="none">
                  <path pathLength={1} d="M6 44 C40 18 150 4 222 14 C262 20 258 48 214 58 C150 72 60 70 30 60 C10 53 20 40 60 34" />
                </svg>
              </span>
            </span>
            <span className="dvh-line dvh-l4" aria-hidden="true">
              {chars("Grow")}
              <span className="dvh-vtag">
                <span>Together</span>
                <i />
              </span>
              <span className="dvh-bracket">
                <svg viewBox="0 0 100 120" preserveAspectRatio="none">
                  <path className="dvh-arc-t" vectorEffect="non-scaling-stroke" d="M4 16 Q50 -8 96 16" />
                  <path className="dvh-arc-b" vectorEffect="non-scaling-stroke" d="M4 104 Q50 128 96 104" />
                </svg>
                Up
              </span>
              <span className="dvh-star">*</span>
            </span>
          </h1>

          <svg className="dvh-curl" viewBox="0 0 100 100" aria-hidden="true">
            <path pathLength={1} d="M92 8 C70 6 52 22 58 40 C63 56 84 52 80 36 C76 22 50 30 40 48 C32 62 26 74 16 84 M14 66 L14 86 L34 86" />
          </svg>

          <div className="dvh-pill" data-perch="" data-perch-x="0.82">
            <span className="dvh-pill-a">No sign-up*</span>
            <Link className="dvh-pill-b" href="/videos">
              Start learning
              <em aria-hidden="true">→</em>
            </Link>
          </div>

          {/* A marigold, spinning slowly */}
          <div className="dvh-flower" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <path d={FLOWER} />
              <circle cx="60" cy="60" r="9" />
            </svg>
          </div>

          <nav aria-label="Where to go">
            <ul className="dvh-services">
              {SERVICES.map((s) => (
                <li key={s.label}>{s.href ? <Link href={s.href}>{s.label}</Link> : s.label}</li>
              ))}
            </ul>
          </nav>

          <button
            ref={charRef}
            type="button"
            className={"dvh-char" + (happy ? " dvh-happy" : "")}
            data-perch=""
            data-perch-x="0.66"
            data-perch-y="0.2"
            onClick={poke}
            aria-label="Say hi to Devi"
          >
            <svg viewBox={"0 0 " + CW + " " + CH} aria-hidden="true">
              <defs>
                <radialGradient id={id("shade")} cx="46%" cy="40%" r="62%">
                  <stop offset="0.55" stopColor="#5a2410" stopOpacity="0" />
                  <stop offset="1" stopColor="#5a2410" stopOpacity="0.32" />
                </radialGradient>
                <radialGradient id={id("hi")} cx="36%" cy="30%" r="42%">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={id("blush")}>
                  <stop offset="0" stopColor="#ff6a6a" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#ff6a6a" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={id("hairsheen")} cx="40%" cy="20%" r="75%">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
                  <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.3" />
                </radialGradient>
                <radialGradient id={id("eye")} cx="40%" cy="35%" r="70%">
                  <stop offset="0" stopColor="#3a2a24" />
                  <stop offset="1" stopColor="#0c0605" />
                </radialGradient>
                <linearGradient id={id("neck")} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a1a0a" stopOpacity="0.45" />
                  <stop offset="0.5" stopColor="#4a1a0a" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id={id("cloth")} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#7a3a00" stopOpacity="0.28" />
                </linearGradient>
                {/* Sindoor buti print on the haldi kurta */}
                <pattern id={id("buti")} width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
                  <path d="M23 9 C27 15 27 21 23 25 C19 21 19 15 23 9 Z M23 25 L23 31 M18 28 Q23 25 28 28" fill={SINDOOR} stroke={SINDOOR} strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="0" cy="40" r="2.2" fill={SINDOOR} />
                  <circle cx="46" cy="40" r="2.2" fill={SINDOOR} />
                </pattern>
                <clipPath id={id("mouth")}>
                  <path d="M244 448 Q300 456 356 448 Q350 510 300 514 Q250 510 244 448 Z" />
                </clipPath>
              </defs>

              <ellipse cx="300" cy="712" rx="250" ry="16" fill="#000" opacity="0.08" />

              <g ref={set("body")}>
                {/* Neck under the collar */}
                <path d="M248 500 L352 500 L358 612 Q300 632 242 612 Z" fill={SKIN} />
                <path d="M248 500 L352 500 L358 612 Q300 632 242 612 Z" fill={u("neck")} />
                {/* Kurta with a round neckline */}
                <path d="M28 730 C40 646 104 604 206 588 Q300 650 394 588 C496 604 560 646 572 730 Z" fill={KURTA} />
                <path d="M28 730 C40 646 104 604 206 588 Q300 650 394 588 C496 604 560 646 572 730 Z" fill={u("buti")} opacity="0.9" />
                <path d="M28 730 C40 646 104 604 206 588 Q300 650 394 588 C496 604 560 646 572 730 Z" fill={u("cloth")} />
                {/* Sindoor trim on the neckline and placket */}
                <path d="M206 588 Q300 650 394 588" fill="none" stroke={SINDOOR} strokeWidth="9" strokeLinecap="round" />
                <path d="M300 619 V700" stroke={SINDOOR} strokeWidth="7" strokeLinecap="round" />
                <path d="M288 622 L300 640 L312 622" fill="none" stroke={SINDOOR} strokeWidth="5" strokeLinejoin="round" />
              </g>

              <g ref={set("head")}>
                {/* Hair behind the head, falling to the plaits */}
                <path d="M120 430 C96 250 176 138 300 138 C424 138 504 250 480 430 C470 450 440 452 430 440 L170 440 C160 452 130 450 120 430 Z" fill={HAIR} />

                <g ref={set("ribbons")}>
                  <Plait side="l" id="l" />
                  <Plait side="r" id="r" />
                </g>

                <g ref={set("earL")}>
                  <ellipse cx="138" cy="380" rx="40" ry="52" fill={SKIN} />
                  <ellipse cx="138" cy="380" rx="40" ry="52" fill={u("shade")} />
                  <path d="M150 352 Q122 362 128 390 Q133 410 150 408" fill="none" stroke="#7a3216" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
                </g>
                <g ref={set("earR")}>
                  <ellipse cx="462" cy="380" rx="40" ry="52" fill={SKIN} />
                  <ellipse cx="462" cy="380" rx="40" ry="52" fill={u("shade")} />
                  <path d="M450 352 Q478 362 472 390 Q467 410 450 408" fill="none" stroke="#7a3216" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
                </g>

                {/* Face */}
                <path d="M300 156 C400 156 466 230 466 350 C466 470 394 556 300 556 C206 556 134 470 134 350 C134 230 200 156 300 156 Z" fill={SKIN} />
                <path d="M300 156 C400 156 466 230 466 350 C466 470 394 556 300 556 C206 556 134 470 134 350 C134 230 200 156 300 156 Z" fill={u("shade")} />
                <path d="M300 156 C400 156 466 230 466 350 C466 470 394 556 300 556 C206 556 134 470 134 350 C134 230 200 156 300 156 Z" fill={u("hi")} />

                <g ref={set("blush")}>
                  <ellipse cx="200" cy="428" rx={happy ? 46 : 40} ry={happy ? 30 : 26} fill={u("blush")} />
                  <ellipse cx="400" cy="428" rx={happy ? 46 : 40} ry={happy ? 30 : 26} fill={u("blush")} />
                </g>

                <g ref={set("face")}>
                  <g ref={set("brows")}>
                    <path d={happy ? "M206 290 Q234 274 262 286" : "M206 298 Q234 286 262 294"} fill="none" stroke="#2a1610" strokeWidth="10" strokeLinecap="round" />
                    <path d={happy ? "M338 286 Q366 274 394 290" : "M338 294 Q366 286 394 298"} fill="none" stroke="#2a1610" strokeWidth="10" strokeLinecap="round" />
                  </g>

                  <g ref={set("eyes")}>
                    {happy ? (
                      <>
                        <path d="M214 358 Q240 326 266 358" fill="none" stroke="#120806" strokeWidth="12" strokeLinecap="round" />
                        <path d="M334 358 Q360 326 386 358" fill="none" stroke="#120806" strokeWidth="12" strokeLinecap="round" />
                      </>
                    ) : (
                      <>
                        <ellipse cx="240" cy="352" rx="27" ry="33" fill={u("eye")} />
                        <circle cx="230" cy="337" r="10" fill="#fff" />
                        <circle cx="251" cy="364" r="4" fill="#fff" opacity="0.85" />
                        <ellipse cx="360" cy="352" rx="27" ry="33" fill={u("eye")} />
                        <circle cx="350" cy="337" r="10" fill="#fff" />
                        <circle cx="371" cy="364" r="4" fill="#fff" opacity="0.85" />
                      </>
                    )}
                  </g>

                  {/* Smile: a soft curve, opening up when she's happy */}
                  {happy ? (
                    <g>
                      <path d="M244 448 Q300 456 356 448 Q350 510 300 514 Q250 510 244 448 Z" fill="#5a1712" />
                      <g clipPath={u("mouth")}>
                        <path d="M240 444 Q300 458 360 444 L360 468 Q300 478 240 468 Z" fill="#fff" />
                        <ellipse cx="300" cy="514" rx="34" ry="18" fill="#d9575a" />
                      </g>
                    </g>
                  ) : (
                    <path d="M254 452 Q300 490 346 452" fill="none" stroke="#6b2416" strokeWidth="9" strokeLinecap="round" />
                  )}

                  <g ref={set("nose")}>
                    <path d="M294 392 Q308 402 296 412" fill="none" stroke="#7a3216" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" />
                  </g>
                </g>

                {/* Hair on top: smooth with a centre parting */}
                <g ref={set("hair")}>
                  <path d="M126 352 C112 200 196 130 300 130 C404 130 488 200 474 352 C466 300 446 262 404 244 C364 228 326 232 300 252 C274 232 236 228 196 244 C154 262 134 300 126 352 Z" fill={HAIR} />
                  <path d="M126 352 C112 200 196 130 300 130 C404 130 488 200 474 352 C466 300 446 262 404 244 C364 228 326 232 300 252 C274 232 236 228 196 244 C154 262 134 300 126 352 Z" fill={u("hairsheen")} />
                  <path d="M300 134 Q297 196 300 250" fill="none" stroke="#5c3b2e" strokeOpacity="0.7" strokeWidth="4" />
                  <path d="M250 150 Q196 172 168 240 M350 150 Q404 172 432 240" fill="none" stroke="#5c3b2e" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
                </g>
              </g>
            </svg>
            <span className="dvh-bubble" data-on={talking ? "true" : "false"} aria-live="polite">
              {GREETINGS[said]}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
