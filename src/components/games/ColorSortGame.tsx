"use client";

import { useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import GameCompletionScreen from "@/components/games/GameCompletionScreen";

const COLORS = [
  { name: "Red", value: "#ef4444", bg: "#fef2f2", border: "#fca5a5", emoji: "🔴" },
  { name: "Blue", value: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", emoji: "🔵" },
  { name: "Green", value: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", emoji: "🟢" },
  { name: "Yellow", value: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", emoji: "🟡" },
];

const BALL_COUNT = 12;

function createBalls() {
  return Array.from({ length: BALL_COUNT }, (_, i) => ({
    id: i,
    colorIdx: Math.floor(Math.random() * COLORS.length),
    sorted: false,
  }));
}

export default function ColorSortGame() {
  const [balls, setBalls] = useState(createBalls);
  const [dragging, setDragging] = useState<number | null>(null);
  const [buckets, setBuckets] = useState<number[][]>([[], [], [], []]);
  const [score, setScore] = useState(0);

  const remaining = balls.filter((b) => !b.sorted);
  const won = remaining.length === 0;

  const handleDrop = (bucketIdx: number) => {
    if (dragging === null) return;
    const ball = balls.find((b) => b.id === dragging);
    if (!ball) return;

    const correct = ball.colorIdx === bucketIdx;
    if (correct) {
      setBalls((prev) => prev.map((b) => (b.id === dragging ? { ...b, sorted: true } : b)));
      setBuckets((prev) => {
        const next = prev.map((b, i) => (i === bucketIdx ? [...b, dragging] : b));
        return next;
      });
      setScore((s) => s + 10);
    }
    setDragging(null);
  };

  const reset = () => {
    setBalls(createBalls());
    setBuckets([[], [], [], []]);
    setScore(0);
    setDragging(null);
  };

  if (won) {
    return (
      <GameCompletionScreen
        score={score}
        stats={[
          { label: "Balls Sorted", value: `${BALL_COUNT} / ${BALL_COUNT}` },
          { label: "Categories", value: "4 Colors" },
        ]}
        onRetry={reset}
        currentGameSlug="color-sort"
        title="Color Sorting Hero!"
        message="You successfully sorted all 12 colored balls into their matching buckets!"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-5 flex-wrap justify-center">
        <span className="text-sm font-semibold text-neutral-600">
          Score: <strong className="text-amber-600 font-extrabold text-base">{score}</strong>
        </span>
        <span className="text-sm font-semibold text-neutral-600">
          Remaining: <strong className="text-neutral-900 font-bold">{remaining.length}</strong>
        </span>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Reset
        </button>
      </div>

      {/* Balls to sort */}
      <div className="w-full rounded-3xl border-2 border-neutral-200/90 bg-white/95 p-6 shadow-md">
        <p className="text-center text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
          Drag each ball into its matching color bucket
        </p>
        <div className="flex flex-wrap gap-3.5 justify-center items-center min-h-16">
          {remaining.map((ball) => (
            <div
              key={ball.id}
              draggable
              onDragStart={() => setDragging(ball.id)}
              onDragEnd={() => setDragging(null)}
              className="w-11 h-11 rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-115 transition-transform border-2 border-white/60"
              style={{
                backgroundColor: COLORS[ball.colorIdx].value,
                boxShadow: `0 4px 14px ${COLORS[ball.colorIdx].value}70`,
              }}
              role="button"
              aria-label={`${COLORS[ball.colorIdx].name} ball`}
            />
          ))}
        </div>
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
        {COLORS.map((color, idx) => (
          <div
            key={idx}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-full min-h-28 rounded-2xl border-2 border-dashed flex flex-wrap gap-1.5 p-2.5 items-center justify-center transition-all shadow-xs"
              style={{
                borderColor: color.border,
                backgroundColor: color.bg,
              }}
            >
              {buckets[idx].map((ballId) => (
                <div
                  key={ballId}
                  className="w-6 h-6 rounded-full shadow-xs border border-white/80"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: color.value }}>
              {color.emoji} {color.name} ({buckets[idx].length})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
