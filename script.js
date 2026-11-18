const PUZZLE_BANK = [
    {
        answer: "MICROWAVE",
        aliases: ["MICROWAVE OVEN"],
        clues: [
            "I spin my contents in a circle while working.",
            "I have a windowed door that lets you watch.",
            "I beep loudly when my job is finished.",
            "I live on most kitchen counters.",
            "Metal objects inside me cause dangerous sparks.",
            "I reheat yesterday's leftovers in seconds."
        ]
    },
    {
        answer: "CACTUS",
        aliases: ["CACTI"],
        clues: [
            "I store water inside my thick green body.",
            "Touching me without gloves is a painful mistake.",
            "I thrive in dry, scorching desert climates.",
            "People often keep tiny versions of me on windowsills.",
            "I rarely need to be watered.",
            "I occasionally bloom bright flowers."
        ]
    },
    {
        answer: "COMPASS",
        aliases: ["MAGNETIC COMPASS"],
        clues: [
            "My needle constantly points in one specific direction.",
            "Hikers and sailors rely on me when GPS fails.",
            "I react to Earth's invisible magnetic field.",
            "I have N, S, E, and W printed on my face.",
            "Holding a magnet near me ruins my accuracy.",
            "I fit easily inside a pocket."
        ]
    }
];

let currentMode = 'daily';
let currentDifficulty = 'easy';
let currentPuzzle = null;
let deck = [];
let score = 1000;
let guessesLeft = 3;
let burnsLeft = 2;
let timeLeft = 45;
let timerInterval = null;
let gameOver = false;
let soundEnabled = true;
let flipsCount = 0;
let liesCaught = 0;

let audioCtx = null;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playClick() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
}

function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'flip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.09);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
    } else if (type === 'burn_lie') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'burn_truth') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(440, now + 0.1);
        osc.frequency.setValueAtTime(550, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    }
}

window.onload = () => {
    updateMenuStats();
    checkAuthSession();
    document.getElementById('guess-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuess();
    });
};

function getDayIndex() {
    const startEpoch = new Date('2026-01-01T00:00:00Z').getTime();
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.floor((todayUTC - startEpoch) / (1000 * 60 * 60 * 24));
}

function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function shuffleWithRng(array, rng) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function updateMenuStats() {
    const dayIdx = Math.abs(getDayIndex());
    document.getElementById('menu-daily-num').innerText = dayIdx + 1;
    const streakVal = localStorage.getItem('smokescreen_streak') || '0';
    const winsVal = localStorage.getItem('smokescreen_wins') || '0';

    document.getElementById('menu-streak').innerText = streakVal;
    document.getElementById('acc-streak').innerText = streakVal;
    document.getElementById('acc-wins').innerText = winsVal;
    document.getElementById('footer-streak-info').innerText = `Streak: ${streakVal}`;

    const isDailyDone = localStorage.getItem('smokescreen_daily_done') === String(dayIdx);
    const dailyBtn = document.getElementById('btn-play-daily');
    if (isDailyDone) {
        dailyBtn.classList.add('locked');
        dailyBtn.querySelector('.hero-btn-text').innerText = "✔ DAILY COMPLETED (LOCKED)";
    }
}

function checkAuthSession() {
    const username = localStorage.getItem('smokescreen_user');
    if (username) {
        document.getElementById('nav-username').innerText = username;
        document.getElementById('profile-name').innerText = username;
        document.getElementById('auth-logged-out').classList.add('hidden');
        document.getElementById('auth-logged-in').classList.remove('hidden');
    } else {
        document.getElementById('nav-username').innerText = "Account";
        document.getElementById('auth-logged-out').classList.remove('hidden');
        document.getElementById('auth-logged-in').classList.add('hidden');
    }
}

function handleLogin() {
    const user = document.getElementById('auth-user-input').value.trim();
    if (!user) { alert("Please enter a valid username."); return; }
    localStorage.setItem('smokescreen_user', user);
    checkAuthSession();
    closeModal('account-modal');
}

function handleGoogleLogin() {
    localStorage.setItem('smokescreen_user', 'GoogleUser_atomicButter');
    checkAuthSession();
    closeModal('account-modal');
}

function handleLogout() {
    localStorage.removeItem('smokescreen_user');
    checkAuthSession();
    closeModal('account-modal');
}

function openModal(modalId) { document.getElementById(modalId).classList.remove('hidden'); }
function closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); }
function toggleInstructions(show) { document.getElementById('instructions-modal').classList.toggle('hidden', !show); }

function toggleAudio() {
    soundEnabled = !soundEnabled;
    document.getElementById('audio-icon').innerText = soundEnabled ? "🔊" : "🔇";
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

function returnToMenu() {
    clearInterval(timerInterval);
    closeModal('end-modal'); closeModal('difficulty-modal'); closeModal('shop-modal'); closeModal('account-modal'); closeModal('settings-modal');
    document.getElementById('game-screen').classList.remove('active-screen');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('active-screen');
    updateMenuStats();
}

function startDailyGame() {
    const dayIdx = Math.abs(getDayIndex());
    if (localStorage.getItem('smokescreen_daily_done') === String(dayIdx)) {
        alert("Daily puzzle already completed for today! Try Arcade mode.");
        return;
    }
    currentMode = 'daily';
    const puzzleObj = PUZZLE_BANK[dayIdx % PUZZLE_BANK.length];
    setupBoard(puzzleObj, mulberry32(dayIdx + 99), `DAILY #${dayIdx + 1}`, 2);
}

function startArcadeGame(diff) {
    closeModal('difficulty-modal');
    currentMode = 'arcade';
    currentDifficulty = diff;
    let lieCount = diff === 'medium' ? 4 : diff === 'hard' ? 5 : diff === 'extreme' ? 6 : 2;
    burnsLeft = Math.min(lieCount, 3);
    const randomPuzzle = PUZZLE_BANK[Math.floor(Math.random() * PUZZLE_BANK.length)];
    setupBoard(randomPuzzle, Math.random, `ARCADE (${diff.toUpperCase()})`, lieCount);
}

function setupBoard(puzzleObj, rng, modeBadgeText, lieCount) {
    currentPuzzle = puzzleObj;
    score = 1000; guessesLeft = 3; timeLeft = 45; gameOver = false; flipsCount = 0; liesCaught = 0;

    document.getElementById('game-mode-badge').innerText = modeBadgeText;
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').disabled = false;

    document.getElementById('main-menu').classList.remove('active-screen');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('active-screen');

    let allOtherClues = [];
    PUZZLE_BANK.forEach(p => { if (p.answer !== puzzleObj.answer) allOtherClues.push(...p.clues); });

    const shuffledLies = shuffleWithRng(allOtherClues, rng).slice(0, lieCount);
    const shuffledClues = shuffleWithRng(puzzleObj.clues, rng).slice(0, 8 - lieCount);

    const rawCards = [
        ...shuffledClues.map(text => ({ text, isLie: false, flipped: false, burned: false })),
        ...shuffledLies.map(text => ({ text, isLie: true, flipped: false, burned: false }))
    ];

    deck = shuffleWithRng(rawCards, rng);
    renderCards();
    updateHUD();
    startTimer();
    setStatus("Dealt! Flip cards and deduce the target.");
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameOver) return;
        timeLeft--;
        updateHUD();
        if (timeLeft <= 0) { score = Math.max(50, score - 100); timeLeft = 45; }
    }, 1000);
}

function renderCards() {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    deck.forEach((card, index) => {
        if (card.removed) return;
        const slot = document.createElement('div');
        slot.className = 'card-slot';
        if (card.flipped) slot.classList.add('flipped');
        if (card.burning) slot.classList.add('is-burning');

        let bottomAction = '';
        if (card.flipped && !card.burned && !gameOver) {
            bottomAction = `<button class="burn-btn" onclick="playClick(); burnCard(event, ${index})">🔥 BURN</button>`;
        } else if (card.burned) {
            bottomAction = `<div class="burn-badge" style="color:var(--accent-red); font-size:10px; font-weight:700;">🔥 INCINERATED</div>`;
        }

        slot.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <span class="card-number">#0${index + 1}</span>
                    <span class="card-qmark">?</span>
                </div>
                <div class="card-face card-front">
                    <p class="clue-text">${card.text}</p>
                    ${bottomAction}
                </div>
            </div>
        `;
        slot.onclick = (e) => { if (e.target.tagName !== 'BUTTON') flipCard(e, index); };
        grid.appendChild(slot);
    });
}

function flipCard(event, index) {
    if (gameOver || deck[index].flipped || deck[index].burned) return;
    deck[index].flipped = true; flipsCount++;
    playSound('flip');
    spawnParticles(event.clientX || 400, event.clientY || 300, '#00f0ff');
    const activeFlips = deck.filter(c => c.flipped && !c.burned).length;
    if (activeFlips > 1) score = Math.max(100, score - 80);
    setStatus(activeFlips === 1 ? "First clue inspection is free!" : "Clue inspected (-80 pts).");
    renderCards(); updateHUD();
}

function burnCard(event, index) {
    event.stopPropagation();
    if (gameOver || burnsLeft <= 0 || deck[index].burned) return;
    burnsLeft--; deck[index].burned = true; deck[index].burning = true;
    triggerShake();

    if (deck[index].isLie) {
        score += 200; liesCaught++;
        playSound('burn_lie');
        spawnParticles(event.clientX, event.clientY, '#f59e0b');
        setStatus("Success! Smokescreen incinerated (+200 pts)!", "#10b981");
    } else {
        score = Math.max(50, score - 200);
        playSound('burn_truth');
        spawnParticles(event.clientX, event.clientY, '#ef4444');
        setStatus("Mistake! You incinerated a real clue (-200 pts)!", "#ef4444");
    }
    renderCards();
    setTimeout(() => { deck[index].removed = true; renderCards(); }, 550);
    updateHUD();
}

function submitGuess() {
    if (gameOver) return;
    const input = document.getElementById('guess-input');
    const guess = input.value.trim().toUpperCase();
    if (!guess) return;
    if ([currentPuzzle.answer, ...currentPuzzle.aliases].includes(guess)) {
        playSound('win'); endRound(true);
    } else {
        guessesLeft--; score = Math.max(50, score - 200);
        triggerShake(); input.value = ''; updateHUD();
        if (guessesLeft <= 0) endRound(false);
        else setStatus(`Incorrect! ${guessesLeft} tries left (-200 pts).`, "#ef4444");
    }
}

function endRound(won) {
    gameOver = true; clearInterval(timerInterval);
    document.getElementById('guess-input').disabled = true;
    deck.forEach(c => { if(!c.removed) c.flipped = true; });
    renderCards();

    if (currentMode === 'daily') {
        const dayIdx = getDayIndex();
        localStorage.setItem('smokescreen_daily_done', String(dayIdx));
        const streak = won ? parseInt(localStorage.getItem('smokescreen_streak') || '0', 10) + 1 : 0;
        localStorage.setItem('smokescreen_streak', String(streak));
        if (won) localStorage.setItem('smokescreen_wins', String(parseInt(localStorage.getItem('smokescreen_wins') || '0', 10) + 1));
    } else if (won) {
        localStorage.setItem('smokescreen_wins', String(parseInt(localStorage.getItem('smokescreen_wins') || '0', 10) + 1));
    }

    let rank = !won ? 'F' : score >= 900 ? 'S' : score >= 700 ? 'A' : score >= 500 ? 'B' : 'C';
    const modal = document.getElementById('end-modal');
    document.getElementById('modal-title').innerText = won ? "CASE SOLVED!" : "INVESTIGATION FAILED";
    document.getElementById('end-icon').innerText = won ? "🏆" : "💀";
    document.getElementById('end-final-score').innerText = `${score} PTS`;
    document.getElementById('rank-badge').innerText = `INVESTIGATION RANK: ${rank}`;
    document.getElementById('modal-answer').innerText = currentPuzzle.answer;
    document.getElementById('modal-stats').innerText = won ? `Flips used: ${flipsCount} • Smokescreens purged: ${liesCaught}` : `Target evaded capture.`;
    modal.classList.remove('hidden');
}

function updateHUD() {
    document.getElementById('hud-score').innerText = score;
    document.getElementById('hud-guesses').innerText = guessesLeft;
    document.getElementById('hud-burns').innerText = burnsLeft;
    document.getElementById('hud-time').innerText = timeLeft;
    const timerFill = document.getElementById('timer-fill');
    timerFill.style.width = `${(timeLeft / 45) * 100}%`;
    timerFill.style.backgroundColor = timeLeft < 15 ? '#ef4444' : 'var(--accent-cyan)';
}

function setStatus(msg, color = "") {
    const banner = document.getElementById('status-banner');
    if(color) banner.style.color = color;
    banner.innerText = msg;
}

function triggerShake() {
    const wrapper = document.getElementById('game-wrapper');
    wrapper.classList.remove('shake');
    void wrapper.offsetWidth;
    wrapper.classList.add('shake');
}

function spawnParticles(x, y, color) {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'pixel-particle';
        p.style.left = `${x}px`; p.style.top = `${y}px`;
        p.style.backgroundColor = color;
        const angle = (Math.PI * 2 * i) / 14, dist = 40 + Math.random() * 40;
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        container.appendChild(p);
        setTimeout(() => p.remove(), 500);
    }
}

function copyShareText() {
    navigator.clipboard.writeText(`SMOKESCREEN | Score: ${score} PTS`).then(() => {
        const btn = document.getElementById('btn-share');
        btn.innerText = "✔ COPIED!";
        setTimeout(() => btn.innerText = "📋 Copy Score", 2000);
    });
}
