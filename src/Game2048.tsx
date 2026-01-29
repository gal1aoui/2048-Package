import { useEffect, useRef, useCallback } from "react";
import { useGameReducer } from "./hooks/useGameReducer";
import { Board } from "./components/Board";
import { ScoreBoard } from "./components/ScoreBoard";
import { StartScreen } from "./components/StartScreen";
import { WinPopup } from "./components/WinPopup";
import { GameOverPopup } from "./components/GameOverPopup";

export function Game2048() {
  const { state, startGame, move, continueAfterWin, reset } = useGameReducer();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (state.gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          move("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          move("right");
          break;
        case "ArrowUp":
          e.preventDefault();
          move("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          move("down");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.gameState, move]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (state.gameState !== "playing") return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [state.gameState],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (state.gameState !== "playing" || !touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const minSwipeDistance = 30;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
        touchStartRef.current = null;
        return;
      }
      absDeltaX > absDeltaY
        ? move(deltaX > 0 ? "right" : "left")
        : move(deltaY > 0 ? "down" : "up");

      touchStartRef.current = null;
    },
    [state.gameState, move],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e: TouchEvent) => {
      if (state.gameState === "playing") {
        e.preventDefault();
      }
    };

    container.addEventListener("touchmove", preventScroll, { passive: false });
    return () => container.removeEventListener("touchmove", preventScroll);
  }, [state.gameState]);

  if (state.gameState === "start") {
    return (
      <div className="game2048-container">
        <StartScreen onStart={startGame} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="game2048-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ScoreBoard
        playerName={state.playerName}
        score={state.score}
        bestScore={state.bestScore}
        onReset={reset}
      />
      <Board board={state.board} />

      {state.gameState === "won" && (
        <WinPopup
          score={state.score}
          onContinue={continueAfterWin}
          onReset={reset}
        />
      )}

      {state.gameState === "lost" && (
        <GameOverPopup score={state.score} onReset={reset} />
      )}
    </div>
  );
}
