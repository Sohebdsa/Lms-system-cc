"use client";

import { DotPattern } from "@/components/ui/dot-pattern";

export default function DotPatternBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#fafafa]">
      {/* Crisp black dots across the entire website with zero hiding gradients */}
      <DotPattern
        width={22}
        height={22}
        cx={2}
        cy={2}
        cr={1.4}
        className="fill-neutral-950/40"
      />
    </div>
  );
}
