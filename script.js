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
        ],
        lies: [
            "I require charcoal or wood chips to operate.",
            "I am primarily used to freeze liquids solid.",
            "I require gasoline to start up each morning.",
            "I fold laundry automatically when closed.",
            "I project holograms onto your kitchen ceiling.",
            "I print receipts every time you cook."
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
        ],
        lies: [
            "I shed thousands of autumn leaves every October.",
            "I swim upstream to lay my eggs.",
            "I grow feathers instead of spines.",
            "I produce fresh apple juice when squeezed.",
            "I require freezing snow to survive.",
            "I glow neon blue at midnight."
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
        ],
        lies: [
            "I measure the temperature of boiling water.",
            "I need to be plugged into a wall outlet to charge.",
            "I dispense hot coffee on demand.",
            "I project movies onto bedroom walls.",
            "I predict tomorrow's lottery numbers.",
            "I bake bread using solar power."
        ]
    }
];

let currentMode = 'daily'; // 'daily' or 'arcade'
let currentDifficulty = 'easy'; // easy, medium, hard, extreme
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
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
    } else if (type === 'burn_lie') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAlt = 600;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'burn_truth') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
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

    // Daily Lock check
    const isDailyDone = localStorage.getItem('smokescreen_daily_done') === String(dayIdx);
    const dailyBtn = document.getElementById('btn-play-daily');
    if (isDailyDone) {
        dailyBtn.classList.add('locked');
        dailyBtn.innerHTML = "✅ DAILY COMPLETED (COME BACK TOMORROW)";
    }
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function toggleInstructions(show) {
    document.getElementById('instructions-modal').classList.toggle('hidden', !show);
}

function toggleAudio() {
    soundEnabled = !soundEnabled;
    document.querySelector('.sound-toggle').innerText = soundEnabled ? "🔊 FX" : "🔇 FX";
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
}

function returnToMenu() {
    clearInterval(timerInterval);
    closeModal('end-modal');
    closeModal('difficulty-modal');
    closeModal('shop-modal');
    closeModal('account-modal');
    closeModal('settings-modal');

    document.getElementById('game-screen').classList.remove('active-screen');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('active-screen');
    updateMenuStats();
}

function startDailyGame() {
    const dayIdx = Math.abs(getDayIndex());
    if (localStorage.getItem('smokescreen_daily_done') === String(dayIdx)) {
        alert("You have already completed today's Daily challenge! Try Arcade mode.");
        return;
    }

    currentMode = 'daily';
    const puzzleObj = PUZZLE_BANK[dayIdx % PUZZLE_BANK.length];
    const rng = mulberry32(dayIdx + 99);
    setupBoard(puzzleObj, rng, `DAILY #${dayIdx + 1}`, 2); // 2 lies for daily
}

function startArcadeGame(diff) {
    closeModal('difficulty-modal');
    currentMode = 'arcade';
    currentDifficulty = diff;

    let lieCount = 2;
    if (diff === 'medium') lieCount = 4;
    if (diff === 'hard') lieCount = 5;
    if (diff === 'extreme') lieCount = 6;

    burnsLeft = Math.min(lieCount, 3);
    const randomPuzzle = PUZZLE_BANK[Math.floor(Math.random() * PUZZLE_BANK.length)];
    setupBoard(randomPuzzle, Math.random, `ARCADE (${diff.toUpperCase()})`, lieCount);
}

function setupBoard(puzzleObj, rng, modeBadgeText, lieCount) {
    currentPuzzle = puzzleObj;
    score = 1000;
    guessesLeft = 3;
    timeLeft = 45;
    gameOver = false;
    flipsCount = 0;
    liesCaught = 0;

    document.getElementById('game-mode-badge').innerText = modeBadgeText;
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').disabled = false;

    document.getElementById('main-menu').classList.remove('active-screen');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('active-screen');

    // Select specified number of lies and true clues to make a total of 8 cards
    const shuffledLies = shuffleWithRng(puzzleObj.lies, rng).slice(0, lieCount);
    const trueCluesNeeded = 8 - lieCount;
    const shuffledClues = shuffleWithRng(puzzleObj.clues, rng).slice(0, trueCluesNeeded);

    const rawCards = [
        ...shuffledClues.map(text => ({ text, isLie: false, flipped: false, burned: false })),
        ...shuffledLies.map(text => ({ text, isLie: true, flipped: false, burned: false }))
    ];

    deck = shuffleWithRng(rawCards, rng);
    renderCards();
    updateHUD();
    startTimer();
    setStatus("DEALT! FLIP CARDS AND DEDUCE THE TARGET.");
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameOver) return;
        timeLeft--;
        updateHUD();
        if (timeLeft <= 0) {
            score = Math.max(50, score - 100);
            timeLeft = 45;
        }
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
            bottomAction = `<button class="burn-btn" onclick="burnCard(event, ${index})">🔥 BURN</button>`;
        } else if (card.burned) {
            bottomAction = `<div class="burn-badge" style="color:var(--accent-red); font-size:10px;">🔥 INCINERATED</div>`;
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

        slot.onclick = (e) => flipCard(e, index);
        grid.appendChild(slot);
    });
}

function flipCard(event, index) {
    if (gameOver || deck[index].flipped || deck[index].burned) return;

    deck[index].flipped = true;
    flipsCount++;
    playSound('flip');
    spawnParticles(event.clientX, event.clientY, '#00f0ff');

    const activeFlips = deck.filter(c => c.flipped && !c.burned).length;
    if (activeFlips > 1) score = Math.max(100, score - 80);

    setStatus(activeFlips === 1 ? "FIRST FLIP FREE!" : "CLUE INSPECTED (-80 PTS).");
    renderCards();
    updateHUD();
}

function burnCard(event, index) {
    event.stopPropagation();
    if (gameOver || burnsLeft <= 0 || deck[index].burned) return;

    burnsLeft--;
    deck[index].burned = true;
    deck[index].burning = true;
    triggerShake();

    const totalLiesInDeck = deck.filter(c => c.isLie).length;

    if (deck[index].isLie) {
        score += 200;
        liesCaught++;
        playSound('burn_lie');
        spawnParticles(event.clientX, event.clientY, '#ffaa00');
        setStatus("SUCCESS! SMOKESCREEN INCINERATED (+200 PTS)!", "#2ce865");
    } else {
        score = Math.max(50, score - 200);
        playSound('burn_truth');
        spawnParticles(event.clientX, event.clientY, '#ff2a55');
        setStatus("MISTAKE! YOU INCINERATED A REAL CLUE (-200 PTS)!", "#ff2a55");
    }

    renderCards();

    setTimeout(() => {
        deck[index].removed = true;
        renderCards();
    }, 550);

    updateHUD();
}

function submitGuess() {
    if (gameOver) return;
    const input = document.getElementById('guess-input');
    const guess = input.value.trim().toUpperCase();
    if (!guess) return;

    const validAnswers = [currentPuzzle.answer, ...currentPuzzle.aliases];

    if (validAnswers.includes(guess)) {
        playSound('win');
        endRound(true);
    } else {
        guessesLeft--;
        score = Math.max(50, score - 200);
        triggerShake();
        input.value = '';
        updateHUD();

        if (guessesLeft <= 0) {
            endRound(false);
        } else {
            setStatus(`WRONG! ${guessesLeft} TRIES LEFT (-200 PTS).`, "#ff2a55");
        }
    }
}

function endRound(won) {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById('guess-input').disabled = true;

    deck.forEach(c => { if(!c.removed) c.flipped = true; });
    renderCards();

    if (currentMode === 'daily' && won) {
        const dayIdx = getDayIndex();
        localStorage.setItem('smokescreen_daily_done', String(dayIdx));
        const streak = parseInt(localStorage.getItem('smokescreen_streak') || '0', 10) + 1;
        localStorage.setItem('smokescreen_streak', String(streak));
        const wins = parseInt(localStorage.getItem('smokescreen_wins') || '0', 10) + 1;
        localStorage.setItem('smokescreen_wins', String(wins));
    } else if (!won && currentMode === 'daily') {
        const dayIdx = getDayIndex();
        localStorage.setItem('smokescreen_daily_done', String(dayIdx));
        localStorage.setItem('smokescreen_streak', '0');
    } else if (won) {
        const wins = parseInt(localStorage.getItem('smokescreen_wins') || '0', 10) + 1;
        localStorage.setItem('smokescreen_wins', String(wins));
    }

    let rank = 'S';
    if (!won) rank = 'F';
    else if (score >= 900) rank = 'S';
    else if (score >= 700) rank = 'A';
    else if (score >= 500) rank = 'B';
    else rank = 'C';

    const modal = document.getElementById('end-modal');
    document.getElementById('modal-title').innerText = won ? "CASE SOLVED!" : "INVESTIGATION FAILED";
    document.getElementById('end-icon').innerText = won ? "🏆" : "💀";
    document.getElementById('end-final-score').innerText = `${score} PTS`;
    document.getElementById('rank-badge').innerText = `INVESTIGATION RANK: ${rank}`;
    document.getElementById('modal-answer').innerText = currentPuzzle.answer;
    document.getElementById('modal-stats').innerText = won 
        ? `Flips used: ${flipsCount} • Smokescreens purged: ${liesCaught}` 
        : `Target evaded capture. Better luck next time!`;

    modal.classList.remove('hidden');
}

function updateHUD() {
    document.getElementById('hud-score').innerText = score;
    document.getElementById('hud-guesses').innerText = guessesLeft;
    document.getElementById('hud-burns').innerText = burnsLeft;
    document.getElementById('hud-time').innerText = timeLeft;

    const timerFill = document.getElementById('timer-fill');
    const pct = (timeLeft / 45) * 100;
    timerFill.style.width = `${pct}%`;
    timerFill.style.backgroundColor = timeLeft < 15 ? '#ff2a55' : 'var(--accent-cyan)';
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
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.backgroundColor = color;

        const angle = (Math.PI * 2 * i) / 14;
        const dist = 40 + Math.random() * 40;
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);

        container.appendChild(p);
        setTimeout(() => p.remove(), 500);
    }
}

function copyShareText() {
    const text = `SMOKESCREEN | Score: ${score} PTS`;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-share');
        btn.innerText = "✅ COPIED!";
        setTimeout(() => btn.innerText = "📋 COPY SCORE", 2000);
    });
}
