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

  const optionStyle = (opt: number): React.CSSProperties => {
    if (chosen === null) return { backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" };
    if (opt === round.answer) return { backgroundColor: "color-mix(in srgb, var(--teal) 10%, transparent)", borderColor: "var(--teal)", color: "var(--teal)" };
    if (opt === chosen) return { backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", borderColor: "var(--primary)", color: "var(--primary)" };
    return { backgroundColor: "color-mix(in srgb, var(--border) 60%, transparent)", borderColor: "var(--border)", color: "var(--muted)", opacity: "0.6" };
  };

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      <div className="flex items-center gap-5 flex-wrap justify-center">
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Score: <strong className="font-extrabold text-base" style={{ color: "var(--accent)" }}>{score}</strong>
        </span>
        {streak >= 2 && (
          <span className="flex items-center gap-1 text-xs font-bold border px-2.5 py-1 rounded-xl shadow-xs animate-pulse"
            style={{ color: "#3A2420", backgroundColor: "var(--accent)", borderColor: "color-mix(in srgb, var(--accent) 70%, transparent)" }}>
            <Lightning size={13} weight="fill" />
            {streak}x Streak!
          </span>
        )}
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Question: <strong className="font-bold" style={{ color: "var(--text)" }}>{questionCount + 1} / {TOTAL_QUESTIONS}</strong>
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

      {/* Question container */}
      <div className="w-full rounded-3xl border-2 p-8 shadow-md" style={{ backgroundColor: "color-mix(in srgb, var(--surface) 95%, transparent)", borderColor: "var(--border)" }}>
        <p className="text-center text-sm mb-6 font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
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
        {round.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="py-4 rounded-2xl text-3xl font-extrabold border-2 transition-all duration-200 active:scale-95 shadow-xs"
            style={{ ...optionStyle(opt), fontFamily: "var(--font-syne, system-ui)" }}
            onMouseEnter={e => { if (chosen === null) { e.currentTarget.style.borderColor = "var(--secondary)"; } }}
            onMouseLeave={e => { if (chosen === null) { e.currentTarget.style.borderColor = "var(--border)"; } }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
