"use client";

import { useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import GameCompletionScreen from "@/components/games/GameCompletionScreen";

const WORD_PAIRS = [
  { en: "Apple", hi: "सेब", kn: "ಸೇಬು" },
  { en: "Mango", hi: "आम", kn: "ಮಾವಿನಹಣ್ಣು" },
  { en: "Water", hi: "पानी", kn: "ನೀರು" },
  { en: "Sun", hi: "सूरज", kn: "ಸೂರ್ಯ" },
  { en: "Book", hi: "किताब", kn: "ಪುಸ್ತಕ" },
  { en: "Tree", hi: "पेड़", kn: "ಮರ" },
];

type Mode = "en-hi" | "en-kn" | "hi-kn";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MatchingGame() {
  const [mode, setMode] = useState<Mode>("en-hi");
  const [selected, setSelected] = useState<{ side: "left" | "right"; index: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [leftOrder, setLeftOrder] = useState(() => shuffle(WORD_PAIRS.map((_, i) => i)));
  const [rightOrder, setRightOrder] = useState(() => shuffle(WORD_PAIRS.map((_, i) => i)));
  const won = matched.size === WORD_PAIRS.length;

  const getLabel = (idx: number, side: "left" | "right") => {
    const pair = WORD_PAIRS[idx];
    if (mode === "en-hi") return side === "left" ? pair.en : pair.hi;
    if (mode === "en-kn") return side === "left" ? pair.en : pair.kn;
    return side === "left" ? pair.hi : pair.kn;
  };

  const handleSelect = (side: "left" | "right", posIndex: number) => {
    const idx = side === "left" ? leftOrder[posIndex] : rightOrder[posIndex];
    if (matched.has(idx)) return;

    if (!selected) {
      setSelected({ side, index: posIndex });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, index: posIndex });
      return;
    }

    setAttempts((a) => a + 1);
    const leftIdx = selected.side === "left" ? leftOrder[selected.index] : leftOrder[posIndex];
    const rightIdx = selected.side === "right" ? rightOrder[selected.index] : rightOrder[posIndex];

    if (leftIdx === rightIdx) {
      setMatched((prev) => new Set([...prev, leftIdx]));
      setScore((s) => s + 15);
      setSelected(null);
    } else {
      setWrong({
        left: selected.side === "left" ? selected.index : posIndex,
        right: selected.side === "right" ? selected.index : posIndex,
      });
      setTimeout(() => {
        setWrong(null);
        setSelected(null);
      }, 700);
    }
  };

  const reset = () => {
    setMatched(new Set());
    setSelected(null);
    setWrong(null);
    setScore(0);
    setAttempts(0);
    setLeftOrder(shuffle(WORD_PAIRS.map((_, i) => i)));
    setRightOrder(shuffle(WORD_PAIRS.map((_, i) => i)));
  };

  const getCardState = (side: "left" | "right", posIndex: number) => {
    const idx = side === "left" ? leftOrder[posIndex] : rightOrder[posIndex];
    if (matched.has(idx)) return "matched";
    if (selected?.side === side && selected.index === posIndex) return "selected";
    if (wrong && ((side === "left" && wrong.left === posIndex) || (side === "right" && wrong.right === posIndex)))
      return "wrong";
    return "idle";
  };

  if (won) {
    return (
      <GameCompletionScreen
        score={score}
        stats={[
          { label: "Pairs Matched", value: `${WORD_PAIRS.length} / ${WORD_PAIRS.length}` },
          { label: "Total Attempts", value: attempts },
          { label: "Language", value: mode === "en-hi" ? "EN-HI" : mode === "en-kn" ? "EN-KN" : "HI-KN" },
        ]}
        onRetry={reset}
        currentGameSlug="word-matching"
        title="Vocabulary Champion!"
        message="You successfully matched all multilingual word pairs!"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(["en-hi", "en-kn", "hi-kn"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              mode === m
                ? "btn-coral text-white shadow-md shadow-coral-500/20"
                : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            {m === "en-hi" ? "English ⇄ हिंदी" : m === "en-kn" ? "English ⇄ ಕನ್ನಡ" : "हिंदी ⇄ ಕನ್ನಡ"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-neutral-600">
          Score: <strong className="text-amber-600 font-extrabold text-base">{score}</strong>
        </span>
        <span className="text-sm font-semibold text-neutral-600">
          Matched: <strong className="text-neutral-900 font-bold">{matched.size} / {WORD_PAIRS.length}</strong>
        </span>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2.5">
          {leftOrder.map((_, posIndex) => {
            const state = getCardState("left", posIndex);
            return (
              <button
                key={posIndex}
                onClick={() => handleSelect("left", posIndex)}
                disabled={state === "matched"}
                className={`px-4 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all duration-200 active:scale-95 text-center ${
                  state === "matched"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 cursor-default opacity-90 shadow-xs"
                    : state === "selected"
                    ? "bg-coral-50 border-coral-500 text-coral-800 shadow-md scale-[1.02]"
                    : state === "wrong"
                    ? "bg-rose-50 border-rose-500 text-rose-700 animate-shake"
                    : "bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 shadow-xs"
                }`}
              >
                {getLabel(leftOrder[posIndex], "left")}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          {rightOrder.map((_, posIndex) => {
            const state = getCardState("right", posIndex);
            return (
              <button
                key={posIndex}
                onClick={() => handleSelect("right", posIndex)}
                disabled={state === "matched"}
                className={`px-4 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all duration-200 active:scale-95 text-center ${
                  state === "matched"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 cursor-default opacity-90 shadow-xs"
                    : state === "selected"
                    ? "bg-amber-50 border-amber-500 text-amber-800 shadow-md scale-[1.02]"
                    : state === "wrong"
                    ? "bg-rose-50 border-rose-500 text-rose-700 animate-shake"
                    : "bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 shadow-xs"
                }`}
              >
                {getLabel(rightOrder[posIndex], "right")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
