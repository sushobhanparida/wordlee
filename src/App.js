import './App.css';
import Game from './Game';
import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    window.location.href = 'https://wordlee-ldyx.onrender.com/auth/discord';
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('wordleeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const avatar = urlParams.get('avatar');
    const id = urlParams.get('id');

    if (username && id) {
      const newUser = { username, avatar, id };
      setUser(newUser);
      localStorage.setItem('wordleeUser', JSON.stringify(newUser));
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="App">
      <h1>Wordlee</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <Game user={user} />
        </>
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;