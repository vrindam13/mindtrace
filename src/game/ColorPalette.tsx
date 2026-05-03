import { motion } from "framer-motion";
import { CellColor, COLOR_CLASSES } from "@/game/echo";
import { cn } from "@/lib/utils";

interface PaletteProps {
  selected: CellColor | "eraser";
  onSelect: (c: CellColor | "eraser") => void;
  colors: Exclude<CellColor, null>[];
}

export function ColorPalette({ selected, onSelect, colors }: PaletteProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-5">
      {colors.map((c) => {
        const meta = COLOR_CLASSES[c];
        const active = selected === c;
        return (
          <motion.button
            key={c}
            type="button"
            whileTap={{ scale: 0.92 }}
            animate={{ scale: active ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onClick={() => onSelect(c)}
            className={cn(
              "w-11 h-11 rounded-full transition-shadow",
              meta.bg,
              active
                ? `ring-2 ring-white ring-offset-4 ring-offset-background ${meta.glow}`
                : "opacity-70 hover:opacity-100"
            )}
            aria-label={c}
            aria-pressed={active}
          />
        );
      })}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        animate={{ scale: selected === "eraser" ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        onClick={() => onSelect("eraser")}
        className={cn(
          "w-11 h-11 rounded-full border border-border bg-cell-empty flex items-center justify-center text-muted-foreground transition-shadow",
          selected === "eraser"
            ? "ring-2 ring-white ring-offset-4 ring-offset-background text-foreground"
            : "opacity-70 hover:opacity-100"
        )}
        aria-label="eraser"
        aria-pressed={selected === "eraser"}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18" />
        </svg>
      </motion.button>
    </div>
  );
}
