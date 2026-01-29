import { useRef } from 'react';
import { getHighScores, ScoreEntry } from '../utils/storage';

interface StartScreenProps {
  onStart: (playerName: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const highScores = getHighScores();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (name) {
      onStart(name);
    }
  };

  return (
    <div className="game2048-start-screen">
      <h1 className="game2048-title">2048</h1>
      <p className="game2048-subtitle">Join the tiles, get to 2048!</p>

      <form className="game2048-start-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="game2048-name-input"
          placeholder="Enter your name"
          maxLength={20}
          autoFocus
          required
        />
        <button type="submit" className="game2048-start-button">
          Start Game
        </button>
      </form>

      {highScores.length > 0 && (
        <div className="game2048-high-scores">
          <h3>High Scores</h3>
          <ul className="game2048-scores-list">
            {highScores.slice(0, 5).map((entry: ScoreEntry, index: number) => (
              <li key={index} className="game2048-score-item">
                <span className="game2048-score-rank">#{index + 1}</span>
                <span className="game2048-score-name">{entry.name}</span>
                <span className="game2048-score-value">{entry.score}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="game2048-instructions">
        <p><strong>How to play:</strong></p>
        <p>Use arrow keys or swipe to move tiles.</p>
        <p>Tiles with the same number merge when they touch.</p>
        <p>Reach 2048 to win!</p>
      </div>
    </div>
  );
}
