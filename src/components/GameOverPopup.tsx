interface GameOverPopupProps {
  score: number;
  onReset: () => void;
}

export function GameOverPopup({ score, onReset }: GameOverPopupProps) {
  return (
    <div className="game2048-popup-overlay">
      <div className="game2048-popup game2048-popup-gameover">
        <h2 className="game2048-popup-title">Game Over!</h2>
        <p className="game2048-popup-message">
          No more moves available.
        </p>
        <p className="game2048-popup-score">
          Final Score: <strong>{score}</strong>
        </p>
        <div className="game2048-popup-buttons">
          <button className="game2048-restart-button" onClick={onReset}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
