interface ScoreBoardProps {
  playerName: string;
  score: number;
  bestScore: number;
  onReset: () => void;
}

export function ScoreBoard({ playerName, score, bestScore, onReset }: ScoreBoardProps) {
  return (
    <div className="game2048-scoreboard">
      <div className="game2048-header">
        <h1 className="game2048-logo">2048</h1>
        <div className="game2048-scores">
          <div className="game2048-score-box">
            <span className="game2048-score-label">Score</span>
            <span className="game2048-score-number">{score}</span>
          </div>
          <div className="game2048-score-box">
            <span className="game2048-score-label">Best</span>
            <span className="game2048-score-number">{bestScore}</span>
          </div>
        </div>
      </div>
      <div className="game2048-info-bar">
        <span className="game2048-player-name">Player: {playerName}</span>
        <button className="game2048-new-game-button" onClick={onReset}>
          New Game
        </button>
      </div>
    </div>
  );
}
