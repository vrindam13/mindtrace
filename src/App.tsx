import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import type { CellColor } from "@/game/echo";
import { colorsInPattern, generatePattern, getLevelConfig, scorePattern } from "@/game/echo";
import { HomeScreen } from "@/game/screens/HomeScreen";
import { FlashScreen } from "@/game/screens/FlashScreen";
import { RecallScreen } from "@/game/screens/RecallScreen";
import { RevealScreen } from "@/game/screens/RevealScreen";
import { ShareScreen } from "@/game/screens/ShareScreen";

type Screen = "home" | "flash" | "recall" | "reveal" | "share";
interface Round {
  level: number;
  pattern: CellColor[];
  gridSize: number;
  paletteColors: Exclude<CellColor, null>[];
  displayMs: number;
}
function buildRound(level: number): Round {
  const cfg = getLevelConfig(level);
  const { cells, gridSize } = generatePattern(level);
  return { level, pattern: cells, gridSize, paletteColors: colorsInPattern(cells), displayMs: cfg.displayMs };
}
const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState<Round>(() => buildRound(1));
  const [guess, setGuess] = useState<CellColor[]>(() => Array(round.gridSize * round.gridSize).fill(null));
  const [attempt, setAttempt] = useState(0);
  const score = scorePattern(round.pattern, guess);
  const startLevel = useCallback((nextLevel: number) => {
    const r = buildRound(nextLevel);
    setRound(r);
    setLevel(nextLevel);
    setGuess(Array(r.gridSize * r.gridSize).fill(null));
    setAttempt((a) => a + 1);
    setScreen("flash");
  }, []);
  const retrySameLevel = useCallback(() => {
    setGuess(Array(round.gridSize * round.gridSize).fill(null));
    setAttempt((a) => a + 1);
    setScreen("flash");
  }, [round.gridSize]);
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "home" && <HomeScreen key="home" level={level} onStart={() => startLevel(level)} />}
        {screen === "flash" && (
          <FlashScreen
            key={`flash-${round.level}-${attempt}`}
            pattern={round.pattern}
            gridSize={round.gridSize}
            level={round.level}
            durationMs={round.displayMs}
            onComplete={() => setScreen("recall")}
          />
        )}
        {screen === "recall" && (
          <RecallScreen
            key={`recall-${round.level}-${attempt}`}
            gridSize={round.gridSize}
            level={round.level}
            paletteColors={round.paletteColors}
            onReveal={(g) => { setGuess(g); setScreen("reveal"); }}
          />
        )}
        {screen === "reveal" && (
          <RevealScreen
            key={`reveal-${round.level}-${attempt}`}
            target={round.pattern}
            guess={guess}
            gridSize={round.gridSize}
            level={round.level}
            onShare={() => setScreen("share")}
            onNext={() => startLevel(level + 1)}
            onRetry={retrySameLevel}
            onHome={() => { setLevel(1); const r = buildRound(1); setRound(r); setGuess(Array(r.gridSize * r.gridSize).fill(null)); setScreen("home"); }}
          />
        )}
        {screen === "share" && (
          <ShareScreen
            key="share"
            pattern={round.pattern}
            gridSize={round.gridSize}
            level={round.level}
            score={score}
            onBack={() => setScreen("reveal")}
          />
        )}
      </AnimatePresence>
    </main>
  );
};
export default Index;