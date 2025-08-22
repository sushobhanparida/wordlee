import React, { useState, useEffect } from 'react';
import Board from './Board';
import Keyboard from './Keyboard';

const words = ["abacus", "abroad", "absent", "absorb", "abused", "access", "accord", "across", "acting", "action", "active", "actual", "adjust", "admire", "adopts", "advice", "advise", "aerial", "affair", "affect", "afford", "afraid", "agency", "agenda", "almost", "always", "amount", "animal", "annual", "answer", "anyone", "anyway", "appeal", "appear", "around", "arrive", "artist", "aspect", "assess", "assist", "assume", "assure", "attach", "attack", "attend", "author", "avenue", "backed", "barely", "barrel", "beauty", "became", "become", "before", "behalf", "behind", "belief", "belong", "bellow", "beneath", "beside", "better", "beyond", "border", "borrow", "bottle", "bottom", "bought", "branch", "breath", "bridge", "bright", "broken", "budget", "burden", "bureau", "button", "camera", "campus", "cancel", "cancer", "cannot", "carbon", "career", "carefu", "carpet", "caught", "center", "chance", "change", "charge", "choice", "choose", "chosen", "church", "circle", "client", "closer", "coffee", "column", "combat", "coming", "common", "comply", "copper", "corner", "costly", "county", "couple", "course", "covers", "create", "credit", "crisis", "custom", "damage", "danger", "dealer", "debate", "decade", "decide", "deeply", "defeat", "defend", "define", "degree", "demand", "depend", "depict", "derive", "design", "desire", "detail", "detect", "device", "devote", "differ", "dinner", "direct", "doctor", "domain", "double", "driven", "driver", "during", "easily", "eating", "editor", "effect", "effort", "eighth", "either", "eleven", "emerge", "enable", "ending", "energy", "engage", "engine", "enough", "ensure", "entire", "entity", "equity", "escape", "estate", "ethnic", "exceed", "except", "excess", "expand", "expect", "expert", "expose", "extend", "extent", "fabric", "facing", "factor", "failed", "fairly", "family", "famous", "father", "fellow", "female", "figure", "filing", "filled", "filter", "financ", "finger", "finish", "fiscal", "flight", "flying", "follow", "forced", "forest", "forget", "formal", "format", "former", "foster", "fought", "fourth", "freely", "friend", "future", "galaxy", "garden", "gather", "gender", "gently", "gifted", "glance", "global", "golden", "ground", "groups", "growth", "guilty", "hardly", "headed", "health", "height", "hidden", "highly", "honest", "impact", "impose", "income", "indeed", "infant", "inform", "injury", "inside", "insist", "intend", "invite", "island", "itself", "junior", "killed", "labour", "lacked", "latter", "launch", "leader", "league", "leaves", "legacy", "length", "lesson", "letter", "lights", "likely", "limits", "linear", "liquid", "listen", "little", "living", "loaded", "locate", "locked", "longer", "losing", "luxury", "mainly", "making", "manage", "manner", "manual", "margin", "market", "master", "matter", "mature", "medium", "member", "memory", "mental", "merely", "method", "middle", "mighty", "minute", "mobile", "modern", "modest", "module", "moment", "mostly", "mother", "motion", "moving", "mutual", "myself", "narrow", "nation", "native", "nature", "nearly", "nights", "nobody", "normal", "notice", "notion", "number", "object", "obtain", "occupy", "offend", "office", "online", "option", "orange", "origin", "others", "output", "oxford", "packed", "palace", "parent", "partly", "passed", "pastor", "patent", "paying", "people", "period", "permit", "person", "phrase", "picked", "planet", "player", "please", "plenty", "pocket", "police", "policy", "prefer", "pretty", "prince", "prints", "prison", "private", "profit", "prompt", "proper", "proved", "public", "pursue", "quarter", "rarely", "rather", "reader", "really", "reason", "recall", "recent", "record", "reduce", "reform", "regard", "regime", "region", "relate", "relief", "remain", "remark", "remote", "remove", "repair", "repeat", "report", "rescue", "reside", "resist", "resort", "result", "retain", "retire", "reveal", "review", "reward", "rights", "rising", "robust", "ruling", "safety", "salary", "sample", "saving", "scheme", "school", "screen", "search", "season", "second", "secret", "sector", "secure", "seeing", "select", "seller", "senior", "series", "server", "settle", "severe", "sexual", "should", "signal", "signed", "silent", "silver", "simple", "simply", "single", "sister", "slight", "smooth", "social", "solely", "sought", "source", "soviet", "speech", "spirit", "spoken", "spread", "spring", "square", "stable", "status", "steady", "stolen", "strain", "stream", "street", "stress", "strict", "strike", "string", "strong", "struck", "studio", "submit", "suffer", "summer", "summit", "supply", "surely", "survey", "switch", "symbol", "system", "taking", "talent", "target", "taught", "tenant", "tender", "tennis", "thanks", "theory", "thirty", "though", "threat", "thrown", "ticket", "timely", "tissue", "titled", "toilet", "toward", "travel", "treaty", "trying", "typical", "unable", "unique", "united", "unless", "unlike", "update", "useful", "valley", "varied", "vendor", "versus", "victim", "vision", "visual", "volume", "walker", "wealth", "weekly", "weight", "wholly", "window", "winner", "winter", "within", "wonder", "wooden", "worker", "working", "worlds", "worry", "worthy", "writing", "written", "yellow", "youngs"];

const Game = ({ user }) => {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    setSolution(words[Math.floor(Math.random() * words.length)]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (isGameOver && user) {
      const gameStatus = guesses.includes(solution) ? 'won' : 'lost';
      fetch('https://wordlee-ldyx.onrender.com/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameStatus, user }),
      });
    }
  }, [isGameOver, user, solution, guesses]);

  const handleKeyPress = (key) => {
    if (isGameOver) return;

    if (key === 'Enter') {
      if (currentGuess.length === 6) {
        if (!words.includes(currentGuess)) {
          alert('Not a valid word!');
          return;
        }
        const newGuesses = [...guesses];
        const guessIndex = guesses.findIndex(val => val === null);
        newGuesses[guessIndex] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === solution) {
          setIsGameOver(true);
          alert('You won!');
        } else if (guessIndex === 5) {
          setIsGameOver(true);
          alert(`You lost! The word was ${solution}`);
        }
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 6 && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
  };

  return (
    <div>
      <Board guesses={guesses} currentGuess={currentGuess} solution={solution} />
      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};

export default Game;
