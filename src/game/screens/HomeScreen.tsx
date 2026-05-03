import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { PillButton } from "@/game/PillButton";

interface Props {
  level: number;
  onStart: () => void;
}

export function HomeScreen({ level, onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-between min-h-screen px-6 py-16"
    >
      <div className="flex-1" />

      <div className="flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.04, 1],
            opacity: 1,
            filter: [
              "drop-shadow(0 0 12px hsl(var(--teal) / 0.45)) drop-shadow(0 0 28px hsl(0 0% 100% / 0.18))",
              "drop-shadow(0 0 22px hsl(var(--teal) / 0.75)) drop-shadow(0 0 48px hsl(0 0% 100% / 0.28))",
              "drop-shadow(0 0 12px hsl(var(--teal) / 0.45)) drop-shadow(0 0 28px hsl(0 0% 100% / 0.18))",
            ],
          }}
          transition={{
            scale: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8, ease: "easeOut" },
          }}
          className="mb-2"
        >
          <Brain className="w-16 h-16 text-foreground" strokeWidth={1.25} />
        </motion.div>
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-7xl sm:text-8xl font-bold tracking-tight glow-text"
        >
          MindTrace
        </motion.h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xs">
          Remember the pattern. Trace it from memory.
        </p>
        <p className="text-teal text-sm tracking-wide mt-2">Level {level}</p>
      </div>

      <div className="flex-1 flex items-end">
        <PillButton onClick={onStart} className="px-10 py-3.5 text-base">
          Start Round
        </PillButton>
      </div>

      <p className="mt-10 text-xs text-muted-foreground tracking-wide">
        45 seconds · Visual memory · Daily challenge
      </p>
    </motion.div>
  );
}
