interface WinPopupProps {
  score: number;
  onContinue: () => void;
  onReset: () => void;
}

export function WinPopup({ score, onContinue, onReset }: WinPopupProps) {
  return (
    <div className="game2048-popup-overlay">
      <div className="game2048-popup">
        <h2 className="game2048-popup-title">You Win!</h2>
        <p className="game2048-popup-message">
          Congratulations! You reached 2048!
        </p>
        <p className="game2048-popup-score">
          Score: <strong>{score}</strong>
        </p>
        <div className="game2048-popup-buttons">
          <button className="game2048-continue-button" onClick={onContinue}>
            Continue Playing
          </button>
          <button className="game2048-restart-button" onClick={onReset}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
