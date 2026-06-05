const games = [
  { name: 'Neon Maze', tag: 'Arcade', description: 'Race through glowing paths and beat the clock.' },
  { name: 'Number Sprint', tag: 'Logic', description: 'Solve fast mental math and stack your streak.' },
  { name: 'Word Whisper', tag: 'Vocabulary', description: 'Build the best word chain before the timer hits zero.' },
  { name: 'Pixel Quest', tag: 'Adventure', description: 'Collect stars and unlock hidden pathways.' },
  { name: 'Skyline Jump', tag: 'Action', description: 'Leap over rooftops in a bright city run.' },
  { name: 'Echo Match', tag: 'Memory', description: 'Match patterns, sounds, and color cues.' },
  { name: 'Code Sprint', tag: 'Coding', description: 'Spot the right snippet in a rapid-fire round.' },
  { name: 'Galaxy Drift', tag: 'Space', description: 'Pilot through asteroid lanes with clever timing.' },
  { name: 'Treasure Trail', tag: 'Puzzle', description: 'Follow clues to uncover the hidden prize.' },
  { name: 'Rainbow Flip', tag: 'Strategy', description: 'Rotate colors to complete every line.' },
  { name: 'Forest Runner', tag: 'Endless', description: 'Dash through branches and collect glowing gems.' },
  { name: 'Cipher Chase', tag: 'Mystery', description: 'Decode the hidden message one symbol at a time.' },
  { name: 'Bridge Builder', tag: 'Creative', description: 'Connect platforms with smart placement.' },
  { name: 'Lightning Grid', tag: 'Quick', description: 'Beat the countdown on each bright grid tile.' },
  { name: 'Ocean Pulse', tag: 'Relaxing', description: 'Sync waves and keep the current flowing.' },
  { name: 'Jungle Rally', tag: 'Speed', description: 'Race through vines and tropical obstacles.' },
  { name: 'Beacon Blast', tag: 'Challenge', description: 'Aim for the safe route and hit every beacon.' },
  { name: 'Moon Lantern', tag: 'Calm', description: 'Light the path with the right glow patterns.' },
  { name: 'Robot Relay', tag: 'Tech', description: 'Guide robots through smart route planning.' },
  { name: 'Crystal Swap', tag: 'Puzzle', description: 'Swap crystals to match every color target.' },
  { name: 'Castle Dash', tag: 'Hero', description: 'Race through towers and collect power-ups.' },
  { name: 'Nova Bounce', tag: 'Physics', description: 'Use timing and arcs to score every bounce.' },
  { name: 'Magic Lock', tag: 'Fantasy', description: 'Unlock each door with the right sequence.' },
  { name: 'Signal Stack', tag: 'Logic', description: 'Build a steady chain of signals and beats.' },
  { name: 'Dino Drift', tag: 'Safari', description: 'Avoid lava and collect prehistoric gems.' },
  { name: 'Star Catch', tag: 'Arcade', description: 'Catch as many stars as possible in one run.' },
  { name: 'Canvas Clash', tag: 'Art', description: 'Use shapes to create the winning picture.' },
  { name: 'Time Trail', tag: 'Speed', description: 'Move through time loops before the clock resets.' },
  { name: 'Comet Collector', tag: 'Space', description: 'Gather falling comets for a huge combo.' },
  { name: 'Magic Garden', tag: 'Calm', description: 'Grow the brightest garden by choosing smart blooms.' },
];

const loginPanel = document.getElementById('loginPanel');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const welcomeName = document.getElementById('welcomeName');
const logoutButton = document.getElementById('logoutButton');
const gamesGrid = document.getElementById('gamesGrid');
const shuffleGamesButton = document.getElementById('shuffleGamesButton');
const randomGameButton = document.getElementById('randomGameButton');
const activeGameTitle = document.getElementById('activeGameTitle');
const activeGameDescription = document.getElementById('activeGameDescription');
const challengeBox = document.getElementById('challengeBox');
const gameCountLabel = document.getElementById('gameCountLabel');

const queryName = new URLSearchParams(window.location.search).get('name');
if (welcomeName) {
  welcomeName.textContent = queryName ? `Welcome, ${queryName}!` : 'Welcome to ECLox';
}

let currentGames = [...games];
let currentRound = null;
let score = 0;

function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomNumber(max) {
  return Math.floor(Math.random() * max);
}

function scrambleWord(word) {
  const chars = [...word];
  let mixed = [...chars];
  for (let i = mixed.length - 1; i > 0; i -= 1) {
    const j = randomNumber(i + 1);
    [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
  }
  return mixed.join('');
}

function buildRound(game) {
  const tag = game.tag;

  if (tag === 'Logic' || tag === 'Coding' || tag === 'Tech') {
    const first = randomNumber(9) + 1;
    const second = randomNumber(9) + 1;
    const answer = first + second;
    const options = shuffleArray([answer, answer + randomNumber(3) + 1, answer - randomNumber(3) - 1]).filter((value, index, all) => all.indexOf(value) === index);
    return {
      prompt: `Quick math: ${first} + ${second} = ?`,
      options: options.slice(0, 3),
      answer,
      hint: 'Choose the correct number to score a point.'
    };
  }

  if (tag === 'Vocabulary' || tag === 'Memory' || tag === 'Art' || tag === 'Creative') {
    const pool = ['ECLox', 'Code', 'Learn', 'Bright', 'Play'];
    const answer = pool[randomNumber(pool.length)];
    const scrambled = scrambleWord(answer);
    const options = shuffleArray([answer, pool[randomNumber(pool.length)], pool[randomNumber(pool.length)]]).filter((value, index, all) => value !== answer || all.indexOf(value) === index);
    return {
      prompt: `Unscramble: ${scrambled}`,
      options: shuffleArray([answer, ...options.slice(0, 2)]),
      answer,
      hint: 'Find the real word that matches the scramble.'
    };
  }

  const theme = ['Neon', 'Star', 'Pulse', 'Glow'][randomNumber(4)];
  const options = shuffleArray([theme, 'Nova', 'Spark', 'Pixel']).filter((value, index, all) => all.indexOf(value) === index).slice(0, 3);
  if (!options.includes(theme)) options[randomNumber(options.length)] = theme;
  return {
    prompt: `Tap the correct theme label for ${game.name}: ${theme}`,
    options,
    answer: theme,
    hint: 'Match the glowing theme word to keep the streak alive.'
  };
}

function renderMiniGame(game) {
  currentRound = buildRound(game);
  score = 0;
  if (!challengeBox) return;

  challengeBox.innerHTML = `
    <div class="mini-game-card">
      <p class="eyebrow">Live game</p>
      <h4>${game.name}</h4>
      <p class="subtle">${game.description}</p>
      <p class="mini-question">${currentRound.prompt}</p>
      <div class="answer-row">
        ${currentRound.options.map((option) => `<button class="game-option" type="button" data-choice="${option}">${option}</button>`).join('')}
      </div>
      <p id="feedbackText" class="small-note">Pick the right answer to score points.</p>
      <p class="small-note">Score: <strong id="scoreLabel">0</strong></p>
    </div>`;

  const feedbackText = document.getElementById('feedbackText');
  const scoreLabel = document.getElementById('scoreLabel');
  const answerButtons = challengeBox.querySelectorAll('.game-option');
  answerButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.choice;
      if (choice === currentRound.answer) {
        score += 1;
        if (scoreLabel) scoreLabel.textContent = String(score);
        if (feedbackText) {
          feedbackText.textContent = `Correct! ${game.name} is active. Keep going.`;
          feedbackText.style.color = '#67fbe7';
        }
        currentRound = buildRound(game);
        const questionText = challengeBox.querySelector('.mini-question');
        if (questionText) questionText.textContent = currentRound.prompt;
        const optionsRow = challengeBox.querySelector('.answer-row');
        if (optionsRow) {
          optionsRow.innerHTML = currentRound.options.map((option) => `<button class="game-option" type="button" data-choice="${option}">${option}</button>`).join('');
          optionsRow.querySelectorAll('.game-option').forEach((nextButton) => {
            nextButton.addEventListener('click', () => {
              const nextChoice = nextButton.dataset.choice;
              if (nextChoice === currentRound.answer) {
                score += 1;
                if (scoreLabel) scoreLabel.textContent = String(score);
                if (feedbackText) {
                  feedbackText.textContent = `Nice streak! Score ${score}.`;
                  feedbackText.style.color = '#67fbe7';
                }
                currentRound = buildRound(game);
                questionText.textContent = currentRound.prompt;
                const nextRow = challengeBox.querySelector('.answer-row');
                if (nextRow) {
                  nextRow.innerHTML = currentRound.options.map((opt) => `<button class="game-option" type="button" data-choice="${opt}">${opt}</button>`).join('');
                  nextRow.querySelectorAll('.game-option').forEach((btn) => btn.addEventListener('click', () => handleChoice(btn, game, feedbackText, scoreLabel)));
                }
              } else {
                if (feedbackText) {
                  feedbackText.textContent = `Wrong answer. Hint: ${currentRound.hint}`;
                  feedbackText.style.color = '#d7e3ff';
                }
              }
            });
          });
        }
      } else {
        if (feedbackText) {
          feedbackText.textContent = `Wrong answer. Hint: ${currentRound.hint}`;
          feedbackText.style.color = '#d7e3ff';
        }
      }
    });
  });
}

function handleChoice(button, game, feedbackText, scoreLabel) {
  const choice = button.dataset.choice;
  if (choice === currentRound.answer) {
    score += 1;
    if (scoreLabel) scoreLabel.textContent = String(score);
    if (feedbackText) {
      feedbackText.textContent = `Correct! Your ${game.name} streak is now ${score}.`;
      feedbackText.style.color = '#67fbe7';
    }
    currentRound = buildRound(game);
    const questionText = challengeBox.querySelector('.mini-question');
    if (questionText) questionText.textContent = currentRound.prompt;
    const optionsRow = challengeBox.querySelector('.answer-row');
    if (optionsRow) {
      optionsRow.innerHTML = currentRound.options.map((option) => `<button class="game-option" type="button" data-choice="${option}">${option}</button>`).join('');
      optionsRow.querySelectorAll('.game-option').forEach((nextButton) => {
        nextButton.addEventListener('click', () => handleChoice(nextButton, game, feedbackText, scoreLabel));
      });
    }
  } else {
    if (feedbackText) {
      feedbackText.textContent = `Try again. Hint: ${currentRound.hint}`;
      feedbackText.style.color = '#d7e3ff';
    }
  }
}

function renderGames(list = currentGames) {
  if (!gamesGrid) return;
  gamesGrid.innerHTML = '';
  list.forEach((game, index) => {
    const card = document.createElement('article');
    card.className = 'mini-card game-card';
    const pageMap = {
      'Neon Maze': 'game-neon-maze.html',
      'Number Sprint': 'game-number-sprint.html',
      'Word Whisper': 'game-word-whisper.html',
      'Pixel Quest': 'game-pixel-quest.html'
    };
    const targetPage = pageMap[game.name] || 'games.html';
    card.innerHTML = `
      <p class="eyebrow">${game.tag}</p>
      <h4>${game.name}</h4>
      <p class="subtle">${game.description}</p>
      <a class="cta-button game-link" href="${targetPage}">Play now</a>
    `;
    gamesGrid.appendChild(card);
  });
  if (gameCountLabel) {
    gameCountLabel.textContent = `${list.length} games`;
  }
}

function getChallengePrompt(game) {
  if (game.tag === 'Logic' || game.tag === 'Coding' || game.tag === 'Tech') {
    return { question: 'Solve 7 + 6 = ?', answer: '13', hint: 'Use simple addition to unlock the level.' };
  }
  if (game.tag === 'Vocabulary' || game.tag === 'Memory' || game.tag === 'Art' || game.tag === 'Creative') {
    return { question: 'Type the word ECLox to win the round.', answer: 'eclox', hint: 'Keep the answer lowercase to match the challenge.' };
  }
  return { question: 'Type GO to launch your mini-game.', answer: 'go', hint: 'This quick challenge starts the game instantly.' };
}

function runChallenge(game) {
  const prompt = getChallengePrompt(game);
  const answerInput = document.getElementById('gameAnswer');
  const feedbackText = document.getElementById('feedbackText');
  if (!answerInput || !feedbackText) return;

  const userAnswer = answerInput.value.trim().toLowerCase();
  if (userAnswer === prompt.answer) {
    feedbackText.textContent = `Perfect! ${game.name} is live. You earned a bonus streak.`;
    feedbackText.style.color = '#67fbe7';
  } else {
    feedbackText.textContent = `Not yet. Hint: ${prompt.hint}`;
    feedbackText.style.color = '#d7e3ff';
  }
}

function playGame(index) {
  const game = currentGames[index];
  if (!game) return;
  if (activeGameTitle) activeGameTitle.textContent = game.name;
  if (activeGameDescription) activeGameDescription.textContent = game.description;
  if (challengeBox) {
    renderMiniGame(game);
  }
  document.querySelectorAll('.game-card').forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
}

function shuffleGames() {
  currentGames = [...games].sort(() => Math.random() - 0.5);
  renderGames(currentGames);
  if (challengeBox) challengeBox.textContent = 'Fresh lineup ready. Pick any game card to start.';
}

function initIntroFlow() {
  const introPoster = document.getElementById('introPoster');
  const welcomeVideoWrap = document.getElementById('welcomeVideoWrap');
  const welcomeVideo = document.getElementById('welcomeVideo');
  const welcomeMessage = document.getElementById('welcomeMessage');

  if (!introPoster || !welcomeVideoWrap || !welcomeVideo || !welcomeMessage) return;

  const revealWelcome = async () => {
    welcomeVideoWrap.classList.remove('hidden');
    welcomeMessage.classList.remove('hidden');
    welcomeMessage.textContent = 'Welcome to ECLox !';
    welcomeVideo.currentTime = 0;
    try {
      await welcomeVideo.play();
    } catch (error) {
      console.warn('Welcome video autoplay was blocked:', error);
    }
  };

  introPoster.addEventListener('click', revealWelcome);
  introPoster.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      revealWelcome();
    }
  });
}

function initPwaInstall() {
  const installButton = document.getElementById('installPwaBtn');
  let deferredPrompt = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installButton) {
      installButton.disabled = false;
      installButton.textContent = '⬇ Install ECLox';
    }
  });

  if (installButton) {
    installButton.disabled = true;
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) {
        installButton.textContent = 'Install not available here';
        return;
      }
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        installButton.textContent = 'Installed';
      }
      deferredPrompt = null;
    });
  }
}

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const savedTheme = localStorage.getItem('eclox-theme') || 'dark';
  document.body.classList.toggle('light-mode', savedTheme === 'light');
  toggle.textContent = savedTheme === 'light' ? '🌙 Dark mode' : '🌗 Light mode';
  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('eclox-theme', isLight ? 'light' : 'dark');
    toggle.textContent = isLight ? '🌙 Dark mode' : '🌗 Light mode';
  });
}

function pickRandomGame() {
  const randomIndex = Math.floor(Math.random() * currentGames.length);
  playGame(randomIndex);
}

if (loginForm && loginMessage) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    if (!username || password.length < 4) {
      loginMessage.textContent = 'Please enter a real username and a password with at least 4 characters.';
      return;
    }

    loginMessage.textContent = 'Account verified — opening your ECLox welcome page.';
    window.location.href = `welcome.html?name=${encodeURIComponent(username)}`;
  });
}

if (logoutButton && loginPanel && dashboard && loginForm && loginMessage) {
  logoutButton.addEventListener('click', () => {
    dashboard.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    loginForm.reset();
    loginMessage.textContent = 'You have been logged out. Enter your account details again to continue.';
  });
}

initIntroFlow();
initPwaInstall();
initThemeToggle();

if (shuffleGamesButton) shuffleGamesButton.addEventListener('click', shuffleGames);
if (randomGameButton) randomGameButton.addEventListener('click', pickRandomGame);
if (gamesGrid) {
  gamesGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-index]');
    if (!button) return;
    playGame(Number(button.dataset.index));
  });
}

if (gamesGrid) renderGames();
