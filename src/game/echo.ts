export type CellColor = "coral" | "teal" | "amber" | "lavender" | null;

export const ALL_COLORS: Exclude<CellColor, null>[] = ["coral", "teal", "amber", "lavender"];

export interface LevelConfig {
  gridSize: number;
  colors: number;
  minFilled: number;
  maxFilled: number;
  displayMs: number;
}

export function getLevelConfig(level: number): LevelConfig {
  if (level <= 2) {
    // Level 1: easier (3-4 filled). Level 2: slightly harder (4-5).
    if (level === 1) {
      return { gridSize: 3, colors: 2, minFilled: 3, maxFilled: 4, displayMs: 3000 };
    }
    return { gridSize: 3, colors: 2, minFilled: 4, maxFilled: 5, displayMs: 2800 };
  }
  if (level <= 5) {
    const extra = Math.min(level - 3, 2); // 0..2
    return {
      gridSize: 4,
      colors: 3,
      minFilled: 5 + extra,
      maxFilled: 7 + extra,
      displayMs: 2500 - extra * 150,
    };
  }
  const extra = Math.min(level - 6, 4); // 0..4
  return {
    gridSize: 5,
    colors: 4,
    minFilled: 7 + extra,
    maxFilled: 10 + extra,
    displayMs: Math.max(1400, 2000 - extra * 120),
  };
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate a pattern with cells distributed across the grid (avoid clustering
 * in one corner) by sampling from each quadrant when possible.
 */
export function generatePattern(level: number): { cells: CellColor[]; gridSize: number } {
  const cfg = getLevelConfig(level);
  const total = cfg.gridSize * cfg.gridSize;
  const filled = Math.min(randInt(cfg.minFilled, cfg.maxFilled), total);
  const palette = shuffle(ALL_COLORS).slice(0, cfg.colors);

  const mid = cfg.gridSize / 2;
  const quadrants: number[][] = [[], [], [], []];
  for (let r = 0; r < cfg.gridSize; r++) {
    for (let c = 0; c < cfg.gridSize; c++) {
      const q = (r < mid ? 0 : 2) + (c < mid ? 0 : 1);
      quadrants[q].push(r * cfg.gridSize + c);
    }
  }
  quadrants.forEach((q) => shuffle(q));

  const picked = new Set<number>();
  // Distribute round-robin across quadrants for spatial spread
  let qi = 0;
  while (picked.size < filled) {
    const q = quadrants[qi % 4];
    const idx = q.pop();
    if (idx !== undefined && !picked.has(idx)) picked.add(idx);
    qi++;
    // safety: if all quadrants empty, break
    if (quadrants.every((x) => x.length === 0) && picked.size < filled) break;
  }

  const cells: CellColor[] = Array(total).fill(null);
  // Ensure each color appears at least once if possible
  const indices = shuffle([...picked]);
  indices.forEach((idx, i) => {
    cells[idx] = i < palette.length ? palette[i] : palette[randInt(0, palette.length - 1)];
  });

  return { cells, gridSize: cfg.gridSize };
}

export const COLOR_CLASSES: Record<Exclude<CellColor, null>, { bg: string; glow: string; ring: string; hex: string }> = {
  coral: { bg: "bg-coral", glow: "glow-coral", ring: "ring-coral", hex: "#FF6B6B" },
  teal: { bg: "bg-teal", glow: "glow-teal", ring: "ring-teal", hex: "#4ECDC4" },
  amber: { bg: "bg-amber", glow: "glow-amber", ring: "ring-amber", hex: "#FFD93D" },
  lavender: { bg: "bg-lavender", glow: "glow-lavender", ring: "ring-lavender", hex: "#C589E8" },
};

export function scorePattern(target: CellColor[], guess: CellColor[]): number {
  let correct = 0;
  let relevant = 0;
  for (let i = 0; i < target.length; i++) {
    if (target[i] !== null) {
      relevant++;
      if (guess[i] === target[i]) correct++;
    } else if (guess[i] !== null) {
      relevant += 0.5;
    }
  }
  if (relevant === 0) return 0;
  return Math.round((correct / relevant) * 100);
}

export function scoreMessage(score: number): string {
  if (score === 100) return "Perfect trace.";
  if (score >= 90) return "Near flawless.";
  if (score >= 70) return "Strong recall.";
  if (score >= 50) return "Getting there.";
  return "Keep training.";
}

/** Returns the colors actually used in a pattern, in palette order. */
export function colorsInPattern(cells: CellColor[]): Exclude<CellColor, null>[] {
  const set = new Set<Exclude<CellColor, null>>();
  cells.forEach((c) => c && set.add(c));
  return ALL_COLORS.filter((c) => set.has(c));
}
