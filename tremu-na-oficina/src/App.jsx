import React from 'react';
import GameLogic from './components/GameLogic';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔧 TREMU NA OFICINA 🔧</h1>
        <p>Módulo 10791 - Aplicação Stand-Alone LGP</p>
      </header>

      <main className="app-main">
        <GameLogic />
      </main>
    </div>
  );
}

export default App;
