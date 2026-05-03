import { motion } from "framer-motion";
import { useState } from "react";
import { EchoGrid } from "@/game/EchoGrid";
import { ColorPalette } from "@/game/ColorPalette";
import { PillButton } from "@/game/PillButton";
import type { CellColor } from "@/game/echo";

interface Props {
  gridSize: number;
  level: number;
  paletteColors: Exclude<CellColor, null>[];
  onReveal: (guess: CellColor[]) => void;
}

export function RecallScreen({ gridSize, level, paletteColors, onReveal }: Props) {
  const total = gridSize * gridSize;
  const [selected, setSelected] = useState<CellColor | "eraser">(paletteColors[0] ?? "coral");
  const [guess, setGuess] = useState<CellColor[]>(() => Array(total).fill(null));

  const handleCellClick = (i: number) => {
    setGuess((prev) => {
      const next = [...prev];
      if (selected === "eraser") {
        next[i] = null;
      } else if (prev[i] === selected) {
        next[i] = null;
      } else {
        next[i] = selected;
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-between min-h-screen px-6 py-12 gap-8"
    >
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-teal text-xs tracking-wider-2 uppercase">Level {level}</p>
        <p className="text-xs tracking-wider-2 uppercase text-muted-foreground">
          Recreate
        </p>
      </div>

      <EchoGrid cells={guess} gridSize={gridSize} onCellClick={handleCellClick} />

      <ColorPalette selected={selected} onSelect={setSelected} colors={paletteColors} />

      <PillButton onClick={() => onReveal(guess)} className="mt-2">
        Reveal
      </PillButton>
    </motion.div>
  );
}
