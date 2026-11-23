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

  // Card style helper using Aangan tokens
  const cardStyle = (state: string): React.CSSProperties => {
    if (state === "matched") return { backgroundColor: "color-mix(in srgb, var(--teal) 10%, transparent)", borderColor: "var(--teal)", color: "var(--teal)" };
    if (state === "selected") return { backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", borderColor: "var(--primary)", color: "var(--text)" };
    if (state === "wrong")    return { backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", borderColor: "var(--primary)", color: "var(--primary)" };
    return { backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" };
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(["en-hi", "en-kn", "hi-kn"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              mode === m ? "btn-coral text-white shadow-md" : ""
            }`}
            style={mode !== m ? { backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" } : {}}
          >
            {m === "en-hi" ? "English ⇄ हिंदी" : m === "en-kn" ? "English ⇄ ಕನ್ನಡ" : "हिंदी ⇄ ಕನ್ನಡ"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Score: <strong className="font-extrabold text-base" style={{ color: "var(--accent)" }}>{score}</strong>
        </span>
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Matched: <strong className="font-bold" style={{ color: "var(--text)" }}>{matched.size} / {WORD_PAIRS.length}</strong>
        </span>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {["left", "right"].map((side) => (
          <div key={side} className="flex flex-col gap-2.5">
            {(side === "left" ? leftOrder : rightOrder).map((_, posIndex) => {
              const state = getCardState(side as "left" | "right", posIndex);
              return (
                <button
                  key={posIndex}
                  onClick={() => handleSelect(side as "left" | "right", posIndex)}
                  disabled={state === "matched"}
                  className="px-4 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all duration-200 active:scale-95 text-center"
                  style={{ ...cardStyle(state), ...(state === "selected" ? { transform: "scale(1.02)" } : {}) }}
                >
                  {getLabel((side === "left" ? leftOrder : rightOrder)[posIndex], side as "left" | "right")}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
