"use client";

import { useState, useEffect } from "react";
import { ArrowCounterClockwise, Backspace } from "@phosphor-icons/react";
import GameCompletionScreen from "@/components/games/GameCompletionScreen";

const WORDS = [
  { word: "CAT", hint: "A friendly animal that meows" },
  { word: "DOG", hint: "A loyal animal that barks" },
  { word: "TREE", hint: "A tall plant with leaves and branches" },
  { word: "SUN", hint: "It shines brightly in the sky during day" },
  { word: "BOOK", hint: "You read pages in this to learn stories" },
  { word: "RAIN", hint: "Water that falls from the clouds" },
  { word: "FISH", hint: "It swims underwater and has fins" },
  { word: "BIRD", hint: "It has feathers, wings, and can fly" },
  { word: "STAR", hint: "It twinkles high in the night sky" },
  { word: "MILK", hint: "A healthy white beverage" },
];

const WORDS_PER_GAME = 5;

function shuffleWord(word: string) {
  const arr = word.split("");
  let shuffled = arr;
  while (shuffled.join("") === word) {
    shuffled = arr.sort(() => Math.random() - 0.5);
  }
  return shuffled;
}

export default function LetterScrambleGame() {
  const [wordIdx, setWordIdx] = useState(0);
  const [scrambled, setScrambled] = useState<{ letter: string; used: boolean }[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = WORDS[wordIdx % WORDS.length];

  useEffect(() => {
    if (completed) return;
    const letters = shuffleWord(current.word).map((l) => ({ letter: l, used: false }));
    setScrambled(letters);
    setAnswer([]);
    setStatus("playing");
  }, [wordIdx, completed, current.word]);

  const addLetter = (idx: number) => {
    if (status !== "playing" || completed) return;
    if (scrambled[idx].used) return;
    const newAnswer = [...answer, scrambled[idx].letter];
    setScrambled((prev) => prev.map((l, i) => (i === idx ? { ...l, used: true } : l)));
    setAnswer(newAnswer);

    if (newAnswer.length === current.word.length) {
      const formed = newAnswer.join("");
      if (formed === current.word) {
        setStatus("correct");
        setScore((s) => s + 20);
        const nextSolved = solvedCount + 1;
        setSolvedCount(nextSolved);

        setTimeout(() => {
          if (nextSolved >= WORDS_PER_GAME) {
            setCompleted(true);
          } else {
            setWordIdx((w) => w + 1);
          }
        }, 900);
      } else {
        setStatus("wrong");
        setTimeout(() => {
          const reset = shuffleWord(current.word).map((l) => ({ letter: l, used: false }));
          setScrambled(reset);
          setAnswer([]);
          setStatus("playing");
        }, 800);
      }
    }
  };

  const removeLast = () => {
    if (status !== "playing" || answer.length === 0) return;
    const lastLetter = answer[answer.length - 1];
    const lastUsedIdx = scrambled.map((l, i) => ({ ...l, i })).reverse().find((l) => l.used && l.letter === lastLetter)?.i;
    if (lastUsedIdx === undefined) return;
    setScrambled((prev) => prev.map((l, i) => (i === lastUsedIdx ? { ...l, used: false } : l)));
    setAnswer((prev) => prev.slice(0, -1));
  };

  const reset = () => {
    setWordIdx(0);
    setScore(0);
    setSolvedCount(0);
    setCompleted(false);
    setStatus("playing");
  };

  if (completed) {
    return (
      <GameCompletionScreen
        score={score}
        stats={[
          { label: "Words Solved", value: `${solvedCount} / ${WORDS_PER_GAME}` },
          { label: "Points Earned", value: score },
        ]}
        onRetry={reset}
        currentGameSlug="letter-scramble"
        title="Word Master!"
        message="You successfully unscrambled all 5 vocabulary words!"
      />
    );
  }

  const slotStyle = (i: number): React.CSSProperties => {
    if (status === "correct") return { borderColor: "var(--teal)", backgroundColor: "color-mix(in srgb, var(--teal) 10%, transparent)", color: "var(--teal)" };
    if (status === "wrong") return { borderColor: "var(--primary)", backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)" };
    if (answer[i]) return { borderColor: "var(--secondary)", backgroundColor: "color-mix(in srgb, var(--secondary) 6%, var(--surface))", color: "var(--text)" };
    return { borderStyle: "dashed", borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--border) 40%, transparent)", color: "transparent" };
  };

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      <div className="flex items-center gap-5 flex-wrap justify-center">
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Score: <strong className="font-extrabold text-base" style={{ color: "var(--accent)" }}>{score}</strong>
        </span>
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Word: <strong className="font-bold" style={{ color: "var(--text)" }}>{solvedCount + 1} / {WORDS_PER_GAME}</strong>
        </span>
        <button
          onClick={() => setWordIdx((w) => w + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Skip
        </button>
      </div>

      {/* Hint card */}
      <div className="w-full rounded-2xl border-2 px-6 py-4 text-center shadow-sm"
        style={{ backgroundColor: "color-mix(in srgb, var(--surface) 95%, transparent)", borderColor: "var(--border)" }}>
        <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--primary)" }}>Clue / Hint</p>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{current.hint}</p>
      </div>

      {/* Answer slots */}
      <div className="flex gap-2.5 justify-center flex-wrap">
        {Array.from({ length: current.word.length }).map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-extrabold transition-all shadow-xs"
            style={{ ...slotStyle(i), fontFamily: "var(--font-syne, system-ui)" }}
          >
            {answer[i] || ""}
          </div>
        ))}
      </div>

      {/* Scrambled letter buttons */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        {scrambled.map((item, idx) => (
          <button
            key={idx}
            onClick={() => addLetter(idx)}
            disabled={item.used || status !== "playing"}
            className="w-14 h-14 rounded-2xl text-2xl font-extrabold border-2 transition-all duration-150 active:scale-95"
            style={
              item.used
                ? { opacity: 0.25, cursor: "not-allowed", backgroundColor: "var(--border)", borderColor: "var(--border)", color: "var(--muted)" }
                : { backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)", cursor: "pointer" }
            }
            onMouseEnter={e => { if (!item.used && status === "playing") { e.currentTarget.style.borderColor = "var(--secondary)"; e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--secondary) 8%, var(--surface))"; } }}
            onMouseLeave={e => { if (!item.used && status === "playing") { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.backgroundColor = "var(--surface)"; } }}
          >
            {item.letter}
          </button>
        ))}
      </div>

      {/* Backspace */}
      {answer.length > 0 && status === "playing" && (
        <button
          onClick={removeLast}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors shadow-xs"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <Backspace size={16} weight="bold" />
          Remove last letter
        </button>
      )}
    </div>
  );
}
