import React from 'react';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="App">
      <h1>Welcome to Wordlee</h1>
      <p>Login with Discord to play the game!</p>
      <button onClick={onLogin}>Login with Discord</button>
    </div>
  );
};

export default LandingPage;
