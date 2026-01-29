# @agallaoui/2048

A lightweight, zero-dependency 2048 game React component.

## Features

- Zero runtime dependencies (only React as peer dependency)
- Player name entry with localStorage persistence
- High scores leaderboard
- Responsive design (desktop & mobile)
- Keyboard controls (arrow keys)
- Touch/swipe controls for mobile
- Win popup at 2048 with continue option
- Dark mode support
- CSS animations

## Installation

```bash
npm install @agallaoui/2048
```

## Usage

```jsx
import { Game2048 } from '@agallaoui/2048';
import '@agallaoui/2048/styles.css';

function App() {
  return <Game2048 />;
}

export default App;
```

## How to Play

1. Enter your name to start the game
2. Use **arrow keys** (desktop) or **swipe** (mobile) to move tiles
3. Tiles with the same number merge when they touch
4. Reach **2048** to win!
5. Continue playing after winning to achieve the highest score

## Controls

| Platform | Control |
|----------|---------|
| Desktop  | Arrow keys (↑ ↓ ← →) |
| Mobile   | Swipe gestures |

## Features

### Score Persistence
- Scores are automatically saved to localStorage
- Top 10 high scores are displayed on the start screen
- Personal best score is tracked

### Responsive Design
- Works on all screen sizes
- Optimized for both desktop and mobile devices
- Touch-friendly controls

### Win & Continue
- Win popup appears when you reach 2048
- Option to continue playing for a higher score
- Game over detection when no moves are available

## Styling

The game comes with a default theme that supports both light and dark modes. All styles use the `game2048-` prefix to avoid conflicts.

### CSS Custom Properties

You can customize the appearance by overriding CSS custom properties:

```css
:root {
  --game2048-bg: #faf8ef;
  --game2048-board-bg: #bbada0;
  --game2048-button-bg: #8f7a66;
  /* ... and more */
}
```

## TypeScript Support

This package includes TypeScript type definitions.

```typescript
import { Game2048 } from '@agallaoui/2048';
import type { GameState, ScoreEntry } from '@agallaoui/2048';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Demo

A demo app is included in the `demo/` folder. To run it:

```bash
# From the root directory
cd demo
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode
npm run dev
```

## License

MIT

## Author

[gal1aoui](https://github.com/gal1aoui)
