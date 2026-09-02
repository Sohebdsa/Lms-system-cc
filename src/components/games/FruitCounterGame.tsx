"use client";

import { useState } from "react";
import { ArrowCounterClockwise, Lightning } from "@phosphor-icons/react";
import GameCompletionScreen from "@/components/games/GameCompletionScreen";

const FRUITS = ["🍎", "🍌", "🍊", "🍇", "🍓", "🍑", "🍋", "🥭"];
const TOTAL_QUESTIONS = 5;

function generateRound() {
  const count = Math.floor(Math.random() * 8) + 1;
  const fruitEmoji = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  const fruits = Array.from({ length: count }, () => fruitEmoji);
  const options = new Set([count]);
  while (options.size < 4) {
    const fake = Math.max(1, count + Math.floor(Math.random() * 5) - 2);
    options.add(fake);
  }
  return {
    fruits,
    answer: count,
    options: [...options].sort(() => Math.random() - 0.5),
  };
}

export default function FruitCounterGame() {
  const [round, setRound] = useState(generateRound);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (n: number) => {
    if (chosen !== null || completed) return;
    setChosen(n);
    const isCorrect = n === round.answer;
    const nextQ = questionCount + 1;
    setQuestionCount(nextQ);

    let nextScore = score;
    if (isCorrect) {
      nextScore = score + 20 + streak * 5;
      setScore(nextScore);
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (nextQ >= TOTAL_QUESTIONS) {
        setCompleted(true);
      } else {
        setRound(generateRound());
        setChosen(null);
      }
    }, 900);
  };

  const reset = () => {
    setRound(generateRound());
    setChosen(null);
    setScore(0);
    setQuestionCount(0);
    setCorrectCount(0);
    setStreak(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GameCompletionScreen
        score={score}
        stats={[
          { label: "Questions", value: `${correctCount}/${TOTAL_QUESTIONS}` },
          { label: "Accuracy", value: `${Math.round((correctCount / TOTAL_QUESTIONS) * 100)}%` },
          { label: "Best Streak", value: `${streak}x` },
        ]}
        onRetry={reset}
        currentGameSlug="fruit-counter"
        title="Counting Master!"
        message="You answered all fruit counting challenges!"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      <div className="flex items-center gap-5 flex-wrap justify-center">
        <span className="text-sm font-semibold text-neutral-600">
          Score: <strong className="text-amber-600 font-extrabold text-base">{score}</strong>
        </span>
        {streak >= 2 && (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-xl shadow-xs animate-pulse">
            <Lightning size={13} weight="fill" />
            {streak}x Streak!
          </span>
        )}
        <span className="text-sm font-semibold text-neutral-600">
          Question: <strong className="text-neutral-900 font-bold">{questionCount + 1} / {TOTAL_QUESTIONS}</strong>
        </span>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Reset
        </button>
      </div>

      {/* Question container */}
      <div className="w-full rounded-3xl border-2 border-neutral-200/90 bg-white/95 p-8 shadow-md">
        <p className="text-center text-sm text-neutral-600 mb-6 font-semibold uppercase tracking-wider">
          How many fruits do you count?
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 min-h-24">
          {round.fruits.map((f, i) => (
            <span
              key={i}
              className="text-4xl transition-transform hover:scale-125 cursor-default drop-shadow-sm"
              style={{
                animation: `bounce 1.5s ease-in-out ${i * 0.1}s infinite alternate`,
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        {round.options.map((opt) => {
          const isCorrect = opt === round.answer;
          const isChosen = opt === chosen;
          let cls = "py-4 rounded-2xl text-3xl font-extrabold border-2 transition-all duration-200 active:scale-95 shadow-xs ";
          if (chosen === null) {
            cls += "bg-white border-neutral-200 text-neutral-900 hover:border-coral-500 hover:bg-coral-50/30 hover:shadow-md cursor-pointer";
          } else if (isCorrect) {
            cls += "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md scale-[1.02]";
          } else if (isChosen) {
            cls += "bg-rose-50 border-rose-500 text-rose-700 animate-shake";
          } else {
            cls += "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60";
          }
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className={cls}
              style={{ fontFamily: "var(--font-syne, system-ui)" }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
