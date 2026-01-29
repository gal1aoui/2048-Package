export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

const SCORES_KEY = 'game2048_scores';
const BEST_SCORE_KEY = 'game2048_bestScore';

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function saveScore(name: string, score: number): void {
  if (!isLocalStorageAvailable()) return;

  const scores = getHighScores();
  const entry: ScoreEntry = {
    name,
    score,
    date: new Date().toISOString().split("T")[0],
  };

  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);

  // Keep top 10 scores
  const topScores = scores.slice(0, 10);
  localStorage.setItem(SCORES_KEY, JSON.stringify(topScores));

  // Update best score if needed
  const currentBest = getBestScore();

  score > currentBest && localStorage.setItem(BEST_SCORE_KEY, score.toString());
}

export function getHighScores(): ScoreEntry[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const stored = localStorage.getItem(SCORES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ScoreEntry[];
  } catch {
    return [];
  }
}

export function getBestScore(): number {
  if (!isLocalStorageAvailable()) return 0;

  try {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function clearScores(): void {
  if (!isLocalStorageAvailable()) return;

  localStorage.removeItem(SCORES_KEY);
  localStorage.removeItem(BEST_SCORE_KEY);
}
