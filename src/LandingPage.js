import React from 'react';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-mono">
      <h1 className="text-6xl font-bold mb-8 text-red-500 border-4 border-red-500 p-4 animate-pulse">WORDLEE</h1>
      <p className="text-xl mb-8 text-gray-300">A brutalist take on the classic word game.</p>
      <button
        onClick={onLogin}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 text-2xl border-4 border-red-500 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        LOGIN WITH DISCORD
      </button>
    </div>
  );
};

export default LandingPage;
