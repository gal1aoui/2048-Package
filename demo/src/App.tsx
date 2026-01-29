import { Game2048 } from '@agallaoui/2048';
import '../../src/styles/game.css';

function App() {
  return (
    <Game2048
      buttonText="Play 2048"
      buttonPosition={{ bottom: 20, right: 20 }}
      gamePosition={{ bottom: 80, right: 20 }}
      showCloseButton={true}
      onOpen={() => console.log('Game opened')}
      onClose={() => console.log('Game closed')}
    />
  );
}

export default App;
