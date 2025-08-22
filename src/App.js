import './App.css';
import Game from './Game';
import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    window.location.href = 'https://wordlee-ldyx.onrender.com/auth/discord';
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const avatar = urlParams.get('avatar');
    const id = urlParams.get('id');

    if (username && id) {
      setUser({ username, avatar, id });
    }
  }, []);

  return (
    <div className="App">
      <h1>Wordlee</h1>
      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <button onClick={handleLogin}>Login with Discord</button>
      )}
      <Game user={user} />
    </div>
  );
}

export default App;