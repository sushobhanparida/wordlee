import Game from './Game';
import LandingPage from './LandingPage';
import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/discord';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
      {user ? (
        <>
          <h1 className="text-4xl font-bold mb-8">Wordlee</h1>
          <p className="text-lg mb-4">Welcome, {user.username}!</p>
          <Game user={user} />
        </>
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;