import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { EchoGrid } from "@/game/EchoGrid";
import { PillButton } from "@/game/PillButton";
import { CellColor, scoreMessage, scorePattern } from "@/game/echo";

interface Props {
  target: CellColor[];
  guess: CellColor[];
  gridSize: number;
  level: number;
  onShare: () => void;
  onNext: () => void;
  onRetry: () => void;
  onHome: () => void;
}

const PASS_THRESHOLD = 80;

export function RevealScreen({ target, guess, gridSize, level, onShare, onNext, onRetry, onHome }: Props) {
  const [showScore, setShowScore] = useState(false);
  const score = scorePattern(target, guess);
  const passed = score >= PASS_THRESHOLD;

  useEffect(() => {
    const t = setTimeout(() => setShowScore(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 gap-10"
    >
      <button
        type="button"
        onClick={onHome}
        aria-label="Home"
        className="absolute top-6 left-6 w-10 h-10 rounded-full border border-border bg-cell-empty flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/60 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center gap-2">
        <p className="text-teal text-xs tracking-wider-2 uppercase">Level {level}</p>
        <p className="text-xs tracking-wider-2 uppercase text-muted-foreground">
          Result
        </p>
      </div>

      <EchoGrid cells={target} gridSize={gridSize} revealOverlay={{ target, guess }} />

      <div className="h-32 flex flex-col items-center justify-center">
        {showScore && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-baseline gap-2">
              <motion.span
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="text-6xl sm:text-7xl font-bold glow-text"
              >
                {score}
              </motion.span>
              <span className="text-xl text-muted-foreground">% MindTrace</span>
            </div>
            <p className="text-sm text-muted-foreground tracking-wide">
              {scoreMessage(score)}
            </p>
            {!passed && (
              <p className="text-xs tracking-wider-2 uppercase text-coral mt-1">
                Retry this level
              </p>
            )}
          </motion.div>
        )}
      </div>

      {showScore && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <PillButton variant="teal" onClick={onShare}>
            Share Score
          </PillButton>
          {passed ? (
            <PillButton onClick={onNext}>Next Round</PillButton>
          ) : (
            <PillButton onClick={onRetry}>Try Again</PillButton>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
