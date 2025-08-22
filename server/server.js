require('dotenv').config();
const express = require('express');
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

app.get('/', (req, res) => {
  res.send('Hello from the Wordlee server!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});