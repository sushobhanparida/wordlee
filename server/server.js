require('dotenv').config();
const fs = require('fs');
const express = require('express');

const words = require('./words');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({
  origin: 'https://wordlee-beta.vercel.app',
  credentials: true,
}));

app.get('/auth/discord', (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent('https://wordlee-ldyx.onrender.com/auth/discord/callback')}&response_type=code&scope=identify`;
  res.redirect(discordAuthUrl);
});

app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://wordlee-ldyx.onrender.com/auth/discord/callback',
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = tokenResponse.data;

      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      });

      const user = userResponse.data;
            res.redirect(`https://wordlee-beta.vercel.app/?username=${user.username}&avatar=${user.avatar}&id=${user.id}`);
    } catch (error) {
      console.error('Error with Discord OAuth2:', error);
      res.status(500).send('Error with Discord OAuth2');
    }
  } else {
    res.status(400).send('Missing authorization code');
  }
});



app.get('/api/word-of-the-day', (req, res) => {
  const { userId } = req.query;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const gameStatesPath = './gameStates.json';
  let gameStates = [];
  try {
    const data = fs.readFileSync(gameStatesPath, 'utf8');
    gameStates = JSON.parse(data);
  } catch (error) {
    console.error('Error reading gameStates.json:', error);
  }

  const gameState = gameStates.find(
    (game) => game.userId === userId && game.date === today
  );

  if (gameState) {
    return res.json({ word: gameState.solution, gameState });
  }

  const now = new Date();
  const istOffset = 330; // 5.5 hours in minutes
  const istTime = new Date(now.getTime() + (istOffset * 60 * 1000));
  const startOfYear = new Date(istTime.getFullYear(), 0, 0);
  const diff = istTime - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const word = words[dayOfYear % words.length];
  if (word.length !== 6) {
    console.warn(`Word of the day "${word}" is not 6 letters long.`);
  }
  res.json({ word });
});

app.post('/api/webhook', async (req, res) => {
  const { gameStatus, user } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).send('Webhook URL not configured');
  }

  const embed = {
    title: `Wordlee Game Over!`,
    description: `${user.username} just ${gameStatus} a game of Wordlee!`,
    color: gameStatus === 'won' ? 65280 : 16711680, // Green for win, red for loss
    thumbnail: {
      url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    },
  };

  try {
    await axios.post(webhookUrl, { embeds: [embed] });
    res.status(200).send('Webhook sent successfully');
  } catch (error) {
    console.error('Error sending webhook:', error);
    res.status(500).send('Error sending webhook');
  }
});

app.post('/api/save-game', (req, res) => {
  const { userId, solution, guesses, gameStatus } = req.body;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const gameStatesPath = './gameStates.json';
  let gameStates = [];
  try {
    const data = fs.readFileSync(gameStatesPath, 'utf8');
    gameStates = JSON.parse(data);
  } catch (error) {
    console.error('Error reading gameStates.json:', error);
  }

  const existingGameIndex = gameStates.findIndex(
    (game) => game.userId === userId && game.date === today
  );

  let newGameState = { userId, date: today, solution, guesses, gameStatus };

  if (existingGameIndex !== -1) {
    // Update existing game, preserve webhookTriggered if it exists
    newGameState = { ...gameStates[existingGameIndex], ...newGameState };
  } else {
    // Add new game, set webhookTriggered to false
    newGameState.webhookTriggered = false;
  }

  if (existingGameIndex !== -1) {
    gameStates[existingGameIndex] = newGameState; // Update existing game
  } else {
    gameStates.push(newGameState); // Add new game
  }

  try {
    fs.writeFileSync(gameStatesPath, JSON.stringify(gameStates, null, 2), 'utf8');
    res.status(200).send('Game state saved successfully');
  } catch (error) {
    console.error('Error writing gameStates.json:', error);
    res.status(500).send('Error saving game state');
  }
});

app.post('/api/trigger-webhook', async (req, res) => {
  const { userId, gameStatus } = req.body;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const gameStatesPath = './gameStates.json';
  let gameStates = [];
  try {
    const data = fs.readFileSync(gameStatesPath, 'utf8');
    gameStates = JSON.parse(data);
  } catch (error) {
    console.error('Error reading gameStates.json:', error);
    return res.status(500).send('Error retrieving game state');
  }

  const existingGameIndex = gameStates.findIndex(
    (game) => game.userId === userId && game.date === today
  );

  if (existingGameIndex !== -1) {
    gameStates[existingGameIndex].webhookTriggered = true;
    try {
      fs.writeFileSync(gameStatesPath, JSON.stringify(gameStates, null, 2), 'utf8');
      // Trigger Discord webhook
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (!webhookUrl) {
        return res.status(500).send('Webhook URL not configured');
      }

      const embed = {
        title: `Wordlee Game Over!`,
        description: `${userId} just ${gameStatus} a game of Wordlee!`,
        color: gameStatus === 'won' ? 65280 : 16711680, // Green for win, red for loss
      };

      try {
        await axios.post(webhookUrl, { embeds: [embed] });
        res.status(200).send('Webhook sent successfully');
      } catch (error) {
        console.error('Error sending webhook:', error);
        res.status(500).send('Error sending webhook');
      }
    } catch (error) {
      console.error('Error writing gameStates.json:', error);
      res.status(500).send('Error saving game state');
    }
  } else {
    res.status(404).send('No game state found for today');
  }
});

app.get('/api/game-state', (req, res) => {
  const { userId } = req.query;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const gameStatesPath = './gameStates.json';
  let gameStates = [];
  try {
    const data = fs.readFileSync(gameStatesPath, 'utf8');
    gameStates = JSON.parse(data);
  } catch (error) {
    console.error('Error reading gameStates.json:', error);
    return res.status(500).send('Error retrieving game state');
  }

  const gameState = gameStates.find(
    (game) => game.userId === userId && game.date === today
  );

  if (gameState) {
    res.json(gameState);
  } else {
    res.status(404).send('No game state found for today');
  }
});

app.post('/api/validate-word', async (req, res) => {
  const { word } = req.body;
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (response.status === 200) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.json({ valid: false });
    } else {
      console.error('Error validating word:', error);
      res.status(500).send('Error validating word');
    }
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the Wordlee server!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});