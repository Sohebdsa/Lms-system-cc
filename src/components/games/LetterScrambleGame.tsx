"use client";

import { useState, useEffect } from "react";
import { ArrowCounterClockwise, Trophy, Backspace } from "@phosphor-icons/react";
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

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      <div className="flex items-center gap-5 flex-wrap justify-center">
        <span className="text-sm font-semibold text-neutral-600">
          Score: <strong className="text-amber-600 font-extrabold text-base">{score}</strong>
        </span>
        <span className="text-sm font-semibold text-neutral-600">
          Word: <strong className="text-neutral-900 font-bold">{solvedCount + 1} / {WORDS_PER_GAME}</strong>
        </span>
        <button
          onClick={() => setWordIdx((w) => w + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Skip
        </button>
      </div>

      {/* Hint card */}
      <div className="w-full rounded-2xl border-2 border-neutral-200/90 bg-white/95 px-6 py-4 text-center shadow-sm">
        <p className="text-[11px] font-bold text-coral-600 uppercase tracking-wider mb-1">Clue / Hint</p>
        <p className="text-sm text-neutral-800 font-semibold">{current.hint}</p>
      </div>

      {/* Answer slots */}
      <div className="flex gap-2.5 justify-center flex-wrap">
        {Array.from({ length: current.word.length }).map((_, i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-extrabold transition-all shadow-xs ${
              status === "correct"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md scale-[1.05]"
                : status === "wrong"
                ? "border-rose-500 bg-rose-50 text-rose-700 animate-shake"
                : answer[i]
                ? "border-coral-500 bg-coral-50/50 text-neutral-900 shadow-sm"
                : "border-dashed border-neutral-300 bg-neutral-100/50 text-transparent"
            }`}
            style={{ fontFamily: "var(--font-syne, system-ui)" }}
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
            className={`w-14 h-14 rounded-2xl text-2xl font-extrabold border-2 transition-all duration-150 active:scale-95 ${
              item.used
                ? "opacity-25 cursor-not-allowed bg-neutral-100 border-neutral-200 text-neutral-400"
                : "bg-white border-neutral-200 text-neutral-900 hover:border-coral-500 hover:bg-coral-50/40 hover:shadow-md cursor-pointer shadow-xs"
            }`}
            style={{ fontFamily: "var(--font-syne, system-ui)" }}
          >
            {item.letter}
          </button>
        ))}
      </div>

      {/* Backspace */}
      {answer.length > 0 && status === "playing" && (
        <button
          onClick={removeLast}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 shadow-xs transition-colors"
        >
          <Backspace size={16} weight="bold" />
          Remove last letter
        </button>
      )}
    </div>
  );
}
