import { motion } from "framer-motion";
import type { CellColor } from "@/game/echo";
import { COLOR_CLASSES } from "@/game/echo";
import { cn } from "@/lib/utils";

interface GridProps {
  cells: CellColor[];
  gridSize: number;
  onCellClick?: (index: number) => void;
  revealOverlay?: {
    target: CellColor[];
    guess: CellColor[];
  };
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
}

const sizeMap = {
  sm: { gap: "gap-1.5", base: 32 },
  md: { gap: "gap-2", base: 56 },
  lg: { gap: "gap-2.5", base: 64 },
};

// Per-grid-size cell dimensions (px) so smaller grids feel proportionally larger
const cellPxByGrid: Record<"sm" | "md" | "lg", Record<number, number>> = {
  sm: { 3: 44, 4: 36, 5: 30 },
  md: { 3: 72, 4: 60, 5: 52 },
  lg: { 3: 88, 4: 74, 5: 62 },
};

const radiusByGrid: Record<number, string> = {
  3: "rounded-2xl",
  4: "rounded-xl",
  5: "rounded-lg",
};

export function EchoGrid({ cells, gridSize, onCellClick, revealOverlay, size = "lg", showGlow = false }: GridProps) {
  const s = sizeMap[size];
  const cellPx = cellPxByGrid[size][gridSize] ?? s.base;
  const radius = radiusByGrid[gridSize] ?? "rounded-lg";

  return (
    <div className={cn(showGlow && "glow-success")} style={{ borderRadius: "16px" }}>
    <div
      className={cn("grid mx-auto", s.gap)}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellPx}px)`,
        width: "fit-content",
      }}
    >
      {cells.map((cell, i) => {
        const cellStyle = { width: cellPx, height: cellPx };
        if (revealOverlay) {
          return (
            <RevealCell
              key={i}
              target={revealOverlay.target[i]}
              guess={revealOverlay.guess[i]}
              radius={radius}
              style={cellStyle}
              index={i}
            />
          );
        }

        const colorMeta = cell ? COLOR_CLASSES[cell] : null;
        return (
          <motion.button
            key={i}
            type="button"
            style={cellStyle}
            onClick={() => onCellClick?.(i)}
            whileTap={onCellClick ? { scale: 0.92 } : undefined}
            className={cn(
              radius,
              "transition-colors duration-200",
              colorMeta ? `${colorMeta.bg} ${colorMeta.glow}` : "bg-cell-empty",
              onCellClick && "cursor-pointer hover:brightness-125",
              !onCellClick && "cursor-default"
            )}
            aria-label={`cell ${i}`}
          />
        );
      })}
    </div>
    </div>
  );
}

function RevealCell({
  target,
  guess,
  radius,
  style,
  index,
}: {
  target: CellColor;
  guess: CellColor;
  radius: string;
  style: React.CSSProperties;
  index: number;
}) {
  const correct = target !== null && guess === target;
  const wrong = guess !== null && guess !== target;
  const missing = target !== null && guess === null;

  if (correct) {
    const meta = COLOR_CLASSES[target!];
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.08, 1], opacity: 1 }}
        transition={{ delay: index * 0.02, duration: 0.5 }}
        style={{...style, boxShadow: "0 0 12px 3px rgba(74, 222, 128, 0.6), 0 0 24px 6px rgba(74, 222, 128, 0.25)"}}
        className={cn(radius, meta.bg, "relative flex items-center justify-center")}
        style={{...style, boxShadow: "0 0 12px 3px rgba(74, 222, 128, 0.6), 0 0 24px 6px rgba(74, 222, 128, 0.25)"}}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-background" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>
    );
  }

  if (wrong) {
    const guessMeta = COLOR_CLASSES[guess!];
    const targetMeta = target ? COLOR_CLASSES[target] : null;
    return (
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, -6, 6, -4, 4, 0] }}
        transition={{ delay: index * 0.02, duration: 0.5 }}
        style={style}
        className={cn(radius, "relative overflow-hidden")}
      >
        {targetMeta && (
          <div className={cn("absolute inset-0 opacity-30", targetMeta.bg)} />
        )}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: guessMeta.hex }}
        />
      </motion.div>
    );
  }

  if (missing) {
    const meta = COLOR_CLASSES[target!];
    return (
      <div
        style={{
          ...style,
          border: `2px dashed ${meta.hex}`,
          backgroundColor: `${meta.hex}33`,
        }}
        className={cn(radius, "relative")}
      />
    );
  }

  return <div style={style} className={cn(radius, "bg-cell-empty")} />;
}
