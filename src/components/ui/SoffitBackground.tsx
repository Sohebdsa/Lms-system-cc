"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  bgColor: "#1a0f33",
  colorA: "#6b2bc8",
  colorB: "#8b3fe0",
  colorC: "#e02bc8",
  colorD: "#ffd6f5",
  ambient: 0.24,
  amount: 0.2,
  bounce: 0.38,
  bounceCurve: 4.25,
  breathe: 0.29,
  contrast: 2.45,
  cursor: 1,
  curve: 3.32,
  direct: 0.97,
  dither: 0.58,
  flow: 0.475,
  glow: 0.38,
  grain: 0.062,
  grainAnim: 0,
  horizon: 0.36,
  lacunarity: 1.99,
  lift: 0.11,
  maxDpr: 1,
  midpoint: 0.57,
  moteScale: 7,
  motes: 0.074,
  parallax: 0.0137,
  rock: 0.12,
  roughness: 0.29,
  scale: 0.8,
  sink: 0.24,
  speed: 0.275,
  spillCentre: 0.3,
  spillFloor: 0.26,
  spillWidth: 2.18,
  spread: 0.41,
  steer: -0.13,
  sweep: 0.5,
  tilt: 1.87,
  vignette: 0.21,
  warp: 2.58,
  warpScale: 0.78,
};

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  iResolution;
uniform float iTime;
uniform vec2  iMouse;          // aspect-corrected units, same space as uv
uniform float uScale;          // zoom of the whole picture — uv and the pointer together

uniform vec3  uBg, uColorA, uColorB, uColorC, uColorD;
uniform float uSpeed, uTilt, uRock, uHorizon, uBreathe, uSpread, uCurve, uDirect;
uniform float uBounce, uBounceCurve;
uniform float uSpillCentre, uSpillWidth, uSpillFloor;
uniform float uAmount, uWarp, uWarpScale, uFlow, uRoughness, uLacunarity, uMotes, uMoteScale;
uniform float uAmbient, uContrast, uMidpoint, uSink, uGlow;
uniform float uGrain, uDither, uVignette;
uniform float uSteer, uLift, uSweep, uParallax;

#define OCTAVES 4

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float snoise(vec2 p) {
  const float K1 = 0.366025404, K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += amp * snoise(p);
    p *= uLacunarity;
    amp *= uRoughness;
  }
  return v;
}

vec3 ramp4(float t) {
  vec3 c = mix(uColorA, uColorB, smoothstep(0.00, 0.36, t));
  c = mix(c, uColorC, smoothstep(0.32, 0.70, t));
  c = mix(c, uColorD, smoothstep(0.66, 1.00, t));
  return c;
}

float triDither(vec2 fc) {
  float a = fract(sin(dot(fc, vec2(12.9898, 78.233))) * 43758.5453);
  float b = fract(sin(dot(fc + 17.0, vec2(12.9898, 78.233))) * 43758.5453);
  return (a + b - 1.0) / 255.0;
}

uniform float uGrainAnim;
float houseGrain(vec2 fc) {
  uvec2 q = uvec2(fc) * uvec2(1597334677u, 3812015801u)
          + uint(floor(iTime * 24.0 * uGrainAnim)) * 2654435769u;
  uint n = q.x ^ q.y; n = n * 1664525u + 1013904223u; n ^= n >> 16u; n *= 2246822519u; n ^= n >> 13u;
  float a = float(n & 0xffffu) / 65535.0;
  n *= 3266489917u; n ^= n >> 16u;
  float b = float(n & 0xffffu) / 65535.0;
  return a + b - 1.0;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
  uv *= uScale;
  vec2 iM = iMouse * uScale;
  float t = iTime * uSpeed;

  vec2 p = uv - iM * uParallax;

  float tilt = uTilt + sin(t * 0.13) * uRock + iM.x * uSteer;
  vec2 dir = vec2(cos(tilt), sin(tilt));
  float axis = dot(p, dir);
  float across = dot(p, vec2(-dir.y, dir.x));

  vec2 q = vec2(fbm(p * uWarpScale + vec2(0.0, t * uFlow)),
                fbm(p * uWarpScale + vec2(5.2, 1.3) - t * uFlow * 0.7));
  float air = fbm(p + uWarp * q + vec2(t * 0.12, -t * 0.09)) * 0.5 + 0.5;

  float horizon = uHorizon + sin(t * 0.09 + 2.1) * uBreathe - iM.y * uLift;
  float alt = clamp(0.5 + (axis - horizon) * uSpread + (air - 0.5) * uAmount, 0.0, 1.0);

  float ac = (across - uSpillCentre - iM.x * uSweep) / max(0.05, uSpillWidth);
  float spill = mix(uSpillFloor, 1.0, exp(-ac * ac));

  float direct = pow(alt, max(0.05, uCurve)) * uDirect * spill;
  float bounce = uBounce * pow(1.0 - alt, max(0.05, uBounceCurve));

  float f = uAmbient + direct + bounce;
  f += uMotes * snoise(p * uMoteScale + vec2(-t * 0.5, t * 0.35)) * 0.5 * alt;

  f = clamp((f - uMidpoint) * uContrast + 0.5, 0.0, 1.0);

  vec3 col = ramp4(f);
  col += uColorD * uGlow * pow(f, 4.0);
  col = mix(uBg, col, smoothstep(0.0, max(0.01, uSink), f) * 0.90 + 0.10);

  col *= 1.0 - uVignette * dot(uv, uv);
  { float hgL = clamp(dot(col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
    col += houseGrain(gl_FragCoord.xy) * uGrain * mix(1.0, 4.0 * hgL * (1.0 - hgL), 0.6); }
  col += triDither(gl_FragCoord.xy) * uDither;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

function hexToVec3(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(normalized, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export default function SoffitBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("WebGL2 is not supported on this device/browser.");
      return;
    }

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type);
      if (!sh) throw new Error("Could not create shader");
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        const info = gl!.getShaderInfoLog(sh);
        gl!.deleteShader(sh);
        throw new Error(info || "Shader compilation failed");
      }
      return sh;
    }

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Link error");
      }
    } catch (e) {
      console.error(e);
      return;
    }

    gl.useProgram(program);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const LOC: Record<string, WebGLUniformLocation | null> = {};
    const loc = (n: string) =>
      n in LOC ? LOC[n] : (LOC[n] = gl.getUniformLocation(program, n));
    const u1f = (n: string, v: number) => gl.uniform1f(loc(n), v);
    const u2f = (n: string, x: number, y: number) => gl.uniform2f(loc(n), x, y);
    const u3c = (n: string, hex: string) => {
      const c = hexToVec3(hex);
      gl.uniform3f(loc(n), c[0], c[1], c[2]);
    };

    function applyConfig() {
      gl!.useProgram(program);
      u3c("uBg", CONFIG.bgColor);
      u3c("uColorA", CONFIG.colorA);
      u3c("uColorB", CONFIG.colorB);
      u3c("uColorC", CONFIG.colorC);
      u3c("uColorD", CONFIG.colorD);
      u1f("uScale", CONFIG.scale);
      u1f("uSpeed", CONFIG.speed);
      u1f("uTilt", CONFIG.tilt);
      u1f("uRock", CONFIG.rock);
      u1f("uHorizon", CONFIG.horizon);
      u1f("uBreathe", CONFIG.breathe);
      u1f("uSpread", CONFIG.spread);
      u1f("uCurve", CONFIG.curve);
      u1f("uDirect", CONFIG.direct);
      u1f("uBounce", CONFIG.bounce);
      u1f("uBounceCurve", CONFIG.bounceCurve);
      u1f("uSpillCentre", CONFIG.spillCentre);
      u1f("uSpillWidth", CONFIG.spillWidth);
      u1f("uSpillFloor", CONFIG.spillFloor);
      u1f("uAmount", CONFIG.amount);
      u1f("uWarp", CONFIG.warp);
      u1f("uWarpScale", CONFIG.warpScale);
      u1f("uFlow", CONFIG.flow);
      u1f("uRoughness", CONFIG.roughness);
      u1f("uLacunarity", CONFIG.lacunarity);
      u1f("uMotes", CONFIG.motes);
      u1f("uMoteScale", CONFIG.moteScale);
      u1f("uAmbient", CONFIG.ambient);
      u1f("uContrast", CONFIG.contrast);
      u1f("uMidpoint", CONFIG.midpoint);
      u1f("uSink", CONFIG.sink);
      u1f("uGlow", CONFIG.glow);
      u1f("uGrain", CONFIG.grain);
      u1f("uGrainAnim", CONFIG.grainAnim);
      u1f("uDither", CONFIG.dither);
      u1f("uVignette", CONFIG.vignette);
      u1f("uSteer", CONFIG.steer);
      u1f("uLift", CONFIG.lift);
      u1f("uSweep", CONFIG.sweep);
      u1f("uParallax", CONFIG.parallax);
      resize();
    }

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      const w = Math.max(1, Math.round(window.innerWidth * dpr));
      const h = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.useProgram(program);
      u2f("iResolution", w, h);
    }

    let resizeQueued = false;
    const onResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => {
        resizeQueued = false;
        resize();
      });
    };
    window.addEventListener("resize", onResize, { passive: true });

    const mouse = { x: 0, y: 0, ax: 0, ay: 0, tx: 0, ty: 0, rest: { x: 0, y: 0 } };
    const aim = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      const a = window.innerWidth / window.innerHeight;
      mouse.tx = (clientX / window.innerWidth - 0.5) * a;
      mouse.ty = 0.5 - clientY / window.innerHeight;
    };

    window.addEventListener("pointermove", aim, { passive: true });
    window.addEventListener("pointerdown", aim, { passive: true });

    let visible = true;
    const observer = new IntersectionObserver(
      (es) => {
        visible = es[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    let animId: number;
    let prevT = performance.now();
    let clock = 0;

    function frame(now: number) {
      animId = requestAnimationFrame(frame);

      const raw = now - prevT;
      prevT = now;
      if (!visible || document.hidden) return;

      const ms = raw > 50 ? 50 : raw < 4.167 ? 4.167 : raw;
      const s = ms > 36.7 ? 2.2 : ms * 0.06;
      clock += ms * 0.001;

      const kLead = 0.105 * s;
      const kBody = 0.043 * s;
      mouse.ax += (mouse.tx - mouse.ax) * kLead;
      mouse.ay += (mouse.ty - mouse.ay) * kLead;
      mouse.x += (mouse.ax - mouse.x) * kBody;
      mouse.y += (mouse.ay - mouse.y) * kBody;

      gl!.useProgram(program);
      u1f("iTime", clock);

      if (!CONFIG.cursor) {
        mouse.tx = mouse.rest.x;
        mouse.ty = mouse.rest.y;
      }
      u2f("iMouse", mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    applyConfig();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("pointerdown", aim);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="gl"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none w-screen h-screen -z-50 block"
      style={{
        width: "100vw",
        height: "100vh",
        background: CONFIG.bgColor,
      }}
    />
  );
}
