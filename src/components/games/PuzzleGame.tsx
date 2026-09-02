"use client";

import { useState, useCallback } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import GameCompletionScreen from "@/components/games/GameCompletionScreen";

type Tile = { id: number; pos: number };

function createSolved(size: number) {
  return Array.from({ length: size * size }, (_, i) => ({ id: i, pos: i }));
}

function shuffle(tiles: Tile[]): Tile[] {
  const arr = [...tiles];
  for (let i = arr.length - 2; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i].pos, arr[j].pos] = [arr[j].pos, arr[i].pos];
  }
  return arr;
}

function isSolved(tiles: Tile[]) {
  return tiles.every((t) => t.id === t.pos);
}

export default function PuzzleGame() {
  const SIZE = 3;
  const TOTAL = SIZE * SIZE;
  const [tiles, setTiles] = useState<Tile[]>(() => shuffle(createSolved(SIZE)));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const emptyPos = tiles.find((t) => t.id === TOTAL - 1)!.pos;

  const canMove = (pos: number) => {
    const row = Math.floor(pos / SIZE);
    const col = pos % SIZE;
    const eRow = Math.floor(emptyPos / SIZE);
    const eCol = emptyPos % SIZE;
    return (
      (Math.abs(row - eRow) === 1 && col === eCol) ||
      (Math.abs(col - eCol) === 1 && row === eRow)
    );
  };

  const handleClick = useCallback(
    (tileId: number) => {
      if (won) return;
      setTiles((prev) => {
        const tile = prev.find((t) => t.id === tileId)!;
        if (!canMove(tile.pos)) return prev;
        const newTiles = prev.map((t) => {
          if (t.id === tileId) return { ...t, pos: emptyPos };
          if (t.id === TOTAL - 1) return { ...t, pos: tile.pos };
          return t;
        });
        if (isSolved(newTiles)) {
          setTimeout(() => setWon(true), 400);
        }
        return newTiles;
      });
      setMoves((m) => m + 1);
    },
    [emptyPos, won]
  );

  const reset = () => {
    setTiles(shuffle(createSolved(SIZE)));
    setMoves(0);
    setWon(false);
  };

  const sorted = [...tiles].sort((a, b) => a.pos - b.pos);
  const calculatedScore = Math.max(50, 200 - moves * 5);

  if (won) {
    return (
      <GameCompletionScreen
        score={calculatedScore}
        stats={[
          { label: "Total Moves", value: moves },
          { label: "Efficiency", value: moves < 25 ? "Expert" : moves < 45 ? "Great" : "Good" },
        ]}
        onRetry={reset}
        currentGameSlug="picture-puzzle"
        title="Puzzle Solved!"
        message={`Incredible! You arranged all numbered tiles in ${moves} moves.`}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-neutral-600">
          Moves: <strong className="text-neutral-950 font-bold">{moves}</strong>
        </span>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Shuffle
        </button>
      </div>

      <div
        className="grid gap-2.5 p-3.5 rounded-3xl bg-neutral-100/80 border-2 border-neutral-200/90 shadow-inner"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {sorted.map((tile) => {
          const isEmpty = tile.id === TOTAL - 1;
          const isMovable = canMove(tile.pos);
          return (
            <button
              key={tile.id}
              onClick={() => handleClick(tile.id)}
              disabled={isEmpty || !isMovable}
              className={`w-24 h-24 rounded-2xl text-3xl font-extrabold flex items-center justify-center transition-all duration-200 active:scale-95 ${
                isEmpty
                  ? "bg-transparent cursor-default border-2 border-dashed border-neutral-200"
                  : isMovable
                  ? "bg-white hover:bg-coral-50/50 text-neutral-900 border-2 border-neutral-300 hover:border-coral-500 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-neutral-50 text-neutral-400 cursor-not-allowed border border-neutral-200 shadow-xs"
              }`}
              style={{ fontFamily: "var(--font-syne, system-ui)" }}
            >
              {isEmpty ? "" : tile.id + 1}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-neutral-500 font-medium">
        Arrange numbers 1-8 in order. Click any tile adjacent to the empty spot to slide it.
      </p>
    </div>
  );
}
