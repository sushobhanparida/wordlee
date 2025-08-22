# Wordlee 🎮

Wordlee is a daily word guessing game inspired by Wordle, built with React for the frontend and Node.js for the backend. Challenge yourself to guess the 6-letter word of the day! 🚀

## How to Play 🕹️

1.  **Login:** Access the game and log in using your Discord account. 🔑
2.  **Guess:** Type your 6-letter guess using the on-screen keyboard or your physical keyboard. ⌨️
3.  **Submit:** Press "Enter" to submit your guess. ⏎
4.  **Feedback:** Observe the color-coded feedback on the tiles and the on-screen keyboard to refine your next guess. 💡
5.  **Win or Lose:** Guess the word within 6 attempts to win, or run out of guesses to lose. 🎉/😭

## Development 🧑‍💻

To run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sushobhanparida/wordlee.git
    cd wordlee
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the `server` directory with your Discord API credentials and webhook URL:
    ```
    DISCORD_CLIENT_ID=your_discord_client_id
    DISCORD_CLIENT_SECRET=your_discord_client_secret
    DISCORD_WEBHOOK_URL=your_discord_webhook_url
    ```

5.  **Start the application:**
    ```bash
    npm start
    ```
    This will start both the React frontend and the Node.js backend.

## Deployment 🌐

The frontend is deployed on Vercel and the backend on Render.com. Automatic deployments are triggered on `git push` to the `master` branch.

## Technologies Used 🛠️

*   **Frontend:** React, HTML, CSS
*   **Backend:** Node.js, Express.js
*   **Database:** `gameStates.json` (for game state persistence)
*   **Authentication:** Discord OAuth2
*   **Notifications:** Discord Webhooks
*   **Word Validation:** dictionaryapi.dev

## Features to be Added 💡

1.  Fluid animations while guessing words. ✨
2.  Add an extra guess row if user has guessed 5 letters already (may not be in the right place). ➕
3.  Richer Discord notifications. 🔔
4.  UI beautification all over. 🎨

---

Enjoy playing Wordlee! 😄
