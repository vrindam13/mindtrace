import { motion } from "framer-motion";
import { useEffect } from "react";
import { EchoGrid } from "@/game/EchoGrid";
import { CellColor } from "@/game/echo";

interface Props {
  pattern: CellColor[];
  gridSize: number;
  level: number;
  durationMs?: number;
  onComplete: () => void;
}

 export function FlashScreen({ pattern, gridSize, level, durationMs = 3000, onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(onComplete, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 gap-10"
    >
      <div className="w-full max-w-sm h-[3px] bg-cell-empty rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: durationMs / 1000, ease: "linear" }}
          className="h-full bg-teal glow-teal"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-teal text-xs tracking-wider-2 uppercase">Level {level}</p>
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs tracking-wider-2 uppercase text-muted-foreground"
        >
          Memorise
        </motion.p>
      </div>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EchoGrid cells={pattern} gridSize={gridSize} />
      </motion.div>

      <div className="h-[3px] w-full max-w-sm" />
    </motion.div>
  );
}
