import { motion } from "framer-motion";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { EchoGrid } from "@/game/EchoGrid";
import { PillButton } from "@/game/PillButton";
import type { CellColor } from "@/game/echo";

interface Props {
  pattern: CellColor[];
  gridSize: number;
  level: number;
  score: number;
  onBack: () => void;
}

export function ShareScreen({ pattern, gridSize, level, score, onBack }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0D0D0D",
      });
      const link = document.createElement("a");
      link.download = `mindtrace-${score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("download failed", e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-10 gap-6"
    >
      <button
        onClick={onBack}
        className="self-start text-xs text-muted-foreground hover:text-foreground tracking-wide"
      >
        ← Back
      </button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        ref={cardRef}
        className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-between glow-card"
        style={{
          width: 270,
          height: 480,
          background:
            "radial-gradient(120% 80% at 50% 0%, #1a1a1a 0%, #0D0D0D 60%)",
          padding: "32px 20px 28px",
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-bold tracking-[0.3em] glow-text">MINDTRACE</p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-teal">Level {level}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <EchoGrid cells={pattern} gridSize={gridSize} size="sm" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-bold glow-text">{score}</span>
            <span className="text-base text-muted-foreground">% MindTrace</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-sm text-foreground/90">Can you beat my MindTrace?</p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-teal">
            mindtrace.game
          </p>
        </div>
      </motion.div>

      <PillButton variant="teal" onClick={handleDownload}>
        Download
      </PillButton>
    </motion.div>
  );
}
