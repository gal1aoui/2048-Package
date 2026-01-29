import { useEffect, useRef, useCallback, useReducer } from "react";
import { useGameReducer } from "./hooks/useGameReducer";
import { Board } from "./components/Board";
import { ScoreBoard } from "./components/ScoreBoard";
import { StartScreen } from "./components/StartScreen";
import { WinPopup } from "./components/WinPopup";
import { GameOverPopup } from "./components/GameOverPopup";

export interface Position {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
}

export interface Game2048Props {
  /** Button text to trigger the game */
  buttonText?: string;
  /** Position of the trigger button */
  buttonPosition?: Position;
  /** Position of the game panel when open */
  gamePosition?: Position;
  /** Custom class for the trigger button */
  buttonClassName?: string;
  /** Whether to show close button on the game panel */
  showCloseButton?: boolean;
  /** Callback when game is opened */
  onOpen?: () => void;
  /** Callback when game is closed */
  onClose?: () => void;
  /** Start with game already open */
  defaultOpen?: boolean;
}

type VisibilityState = { isOpen: boolean };
type VisibilityAction = { type: "OPEN" } | { type: "CLOSE" } | { type: "TOGGLE" };

function visibilityReducer(state: VisibilityState, action: VisibilityAction): VisibilityState {
  switch (action.type) {
    case "OPEN":
      return { isOpen: true };
    case "CLOSE":
      return { isOpen: false };
    case "TOGGLE":
      return { isOpen: !state.isOpen };
    default:
      return state;
  }
}

export function Game2048({
  buttonText = "Play 2048",
  buttonPosition = { bottom: 20, right: 20 },
  gamePosition = { bottom: 80, right: 20 },
  buttonClassName,
  showCloseButton = true,
  onOpen,
  onClose,
  defaultOpen = false
}: Game2048Props) {
  const { state, startGame, move, continueAfterWin, reset } = useGameReducer();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const [visibility, dispatchVisibility] = useReducer(visibilityReducer, { isOpen: defaultOpen });

  const handleOpen = useCallback(() => {
    dispatchVisibility({ type: "OPEN" });
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    dispatchVisibility({ type: "CLOSE" });
    onClose?.();
  }, [onClose]);

  // Keyboard controls
  useEffect(() => {
    if (!visibility.isOpen || state.gameState !== "playing") return;

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
        case "Escape":
          handleClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibility.isOpen, state.gameState, move, handleClose]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (state.gameState !== "playing") return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [state.gameState]
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
    [state.gameState, move]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !visibility.isOpen) return;

    const preventScroll = (e: TouchEvent) => {
      if (state.gameState === "playing") {
        e.preventDefault();
      }
    };

    container.addEventListener("touchmove", preventScroll, { passive: false });
    return () => container.removeEventListener("touchmove", preventScroll);
  }, [state.gameState, visibility.isOpen]);

  const formatPosition = (pos: Position): React.CSSProperties => {
    const style: React.CSSProperties = {};
    if (pos.top !== undefined) style.top = typeof pos.top === "number" ? `${pos.top}px` : pos.top;
    if (pos.right !== undefined) style.right = typeof pos.right === "number" ? `${pos.right}px` : pos.right;
    if (pos.bottom !== undefined) style.bottom = typeof pos.bottom === "number" ? `${pos.bottom}px` : pos.bottom;
    if (pos.left !== undefined) style.left = typeof pos.left === "number" ? `${pos.left}px` : pos.left;
    return style;
  };

  const renderGame = () => (
    <div
      ref={containerRef}
      className="game2048-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: "relative" }}
    >
      {showCloseButton && (
        <button className="game2048-close-button" onClick={handleClose} aria-label="Close game">
          ×
        </button>
      )}

      {state.gameState === "start" ? (
        <StartScreen onStart={startGame} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Trigger Button */}
      <div className="game2048-wrapper" style={formatPosition(buttonPosition)}>
        <button
          className={buttonClassName || "game2048-trigger-button"}
          onClick={handleOpen}
          style={{ display: visibility.isOpen ? "none" : "block" }}
        >
          {buttonText}
        </button>
      </div>

      {/* Game Panel */}
      {visibility.isOpen && (
        <div className="game2048-wrapper" style={formatPosition(gamePosition)}>
          {renderGame()}
        </div>
      )}
    </>
  );
}
