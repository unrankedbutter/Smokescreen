// --- PUZZLE DATABASE (Add as many objects as you want!) ---
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
            "I am primarily used to freeze liquids solid."
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
            "I swim upstream to lay my eggs."
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
            "I need to be plugged into a wall outlet to charge."
        ]
    },
    {
        answer: "PIANO",
        aliases: ["GRAND PIANO", "KEYBOARD"],
        clues: [
            "I have 88 black and white triggers.",
            "Inside me, felt hammers strike tight metal strings.",
            "I usually have three foot pedals underneath.",
            "Mozart and Beethoven spent their lives playing me.",
            "Moving me up a flight of stairs takes a crew.",
            "I make music without needing electricity."
        ],
        lies: [
            "You play me by blowing air through a wooden reed.",
            "I fit neatly inside a standard backpack."
        ]
    },
    {
        answer: "UMBRELLA",
        aliases: ["PARASOL"],
        clues: [
            "I collapse into a stick when not in use.",
            "Strong gusts of wind frequently turn me inside out.",
            "Opening me indoors is considered bad luck.",
            "I shield you from falling water.",
            "I have metal ribs stretched under waterproof fabric.",
            "People constantly forget me in restaurants and buses."
        ],
        lies: [
            "I am worn on your feet to climb icy mountains.",
            "I am filled with helium to float above clouds."
        ]
    },
    {
        answer: "MIRROR",
        aliases: ["LOOKING GLASS"],
        clues: [
            "I copy every movement you make instantly.",
            "I flip left and right, but not up and down.",
            "Breaking me supposedly brings seven years of bad luck.",
            "Vampires famously cast no reflection in me.",
            "I am made of glass backed with reflective metal.",
            "You look at me while brushing your teeth."
        ],
        lies: [
            "I absorb all light and emit pitch-black darkness.",
            "I am woven out of heavy cotton yarn."
        ]
    }
];

// --- GAME STATE ---
let currentMode = 'daily'; // 'daily' or 'arcade'
let currentPuzzle = null;
let deck = [];
let score = 1000;
let guessesLeft = 3;
let burnsLeft = 2;
let gameOver = false;
let actionHistory = []; // Tracks emojis for sharing: 🟩, 🟥, 🔥, 💀, 🎯, ❌

// --- INITIALIZATION ---
window.onload = () => {
    updateHUD();
    checkArcadeUnlock();
    loadDailyPuzzle();

    document.getElementById('guess-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuess();
    });
};

// --- SEEDED RANDOM FOR SYNCHRONIZED DAILY PUZZLE ---
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

// --- MODE MANAGEMENT ---
function switchMode(mode) {
    if (mode === 'arcade' && !isArcadeUnlocked()) {
        setStatus("FINISH TODAY'S DAILY FIRST TO UNLOCK ARCADE!", "#ffaa00");
        triggerShake();
        return;
    }
    currentMode = mode;
    document.getElementById('btn-daily').classList.toggle('active', mode === 'daily');
    document.getElementById('btn-arcade').classList.toggle('active', mode === 'arcade');
    document.getElementById('end-modal').classList.add('hidden');

    if (mode === 'daily') {
        loadDailyPuzzle();
    } else {
        startArcadeRound();
    }
}

function isArcadeUnlocked() {
    const dayIdx = getDayIndex();
    return localStorage.getItem('smokescreen_daily_done') === String(dayIdx);
}

function checkArcadeUnlock() {
    const btn = document.getElementById('btn-arcade');
    if (isArcadeUnlocked()) {
        btn.classList.remove('locked');
        btn.innerHTML = "🕹️ ARCADE";
    }
}

// --- PUZZLE SETUP ---
function loadDailyPuzzle() {
    const dayIdx = Math.abs(getDayIndex());
    document.getElementById('daily-number').innerText = dayIdx + 1;
    
    const puzzleObj = PUZZLE_BANK[dayIdx % PUZZLE_BANK.length];
    // Shuffle cards uniquely per session while keeping the exact same daily target
    const rng = mulberry32(dayIdx + Math.floor(Math.random() * 1000));
    setupBoard(puzzleObj, rng);
    setStatus("DAILY CHALLENGE: DODGE THE 2 SMOKESCREENS.");
}

function startArcadeRound() {
    document.getElementById('end-modal').classList.add('hidden');
    const randomIdx = Math.floor(Math.random() * PUZZLE_BANK.length);
    const puzzleObj = PUZZLE_BANK[randomIdx];
    setupBoard(puzzleObj, Math.random);
    setStatus("ARCADE MODE: UNLIMITED RUNS ACTIVE.");
}

function setupBoard(puzzleObj, rng) {
    currentPuzzle = puzzleObj;
    score = 1000;
    guessesLeft = 3;
    burnsLeft = 2;
    gameOver = false;
    actionHistory = [];
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').disabled = false;

    const rawCards = [
        ...puzzleObj.clues.map(text => ({ text, isLie: false, flipped: false, burned: false })),
        ...puzzleObj.lies.map(text => ({ text, isLie: true, flipped: false, burned: false }))
    ];

    deck = shuffleWithRng(rawCards, rng);
    renderCards();
    updateHUD();
}

// --- RENDERING & INTERACTIONS ---
function renderCards() {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';

    deck.forEach((card, index) => {
        const slot = document.createElement('div');
        slot.className = 'card-slot';
        slot.style.animationDelay = `${index * 0.05}s`;
        if (card.flipped) slot.classList.add('flipped');
        if (card.burned) {
            slot.classList.add(card.isLie ? 'burned-lie' : 'burned-truth');
        }

        let bottomAction = '';
        if (card.flipped && !card.burned && !gameOver) {
            bottomAction = `<button class="burn-btn" onclick="burnCard(event, ${index})">🔥 BURN LIE</button>`;
        } else if (card.burned) {
            bottomAction = card.isLie 
                ? `<div class="burn-badge badge-lie">🔥 LIE BURNED!</div>`
                : `<div class="burn-badge badge-truth">💀 BURNED TRUTH</div>`;
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
    if (gameOver || deck[index].flipped) return;

    deck[index].flipped = true;
    spawnParticles(event.clientX, event.clientY, '#00f0ff');

    // First flip is free; subsequent flips cost 100 pts
    const flippedCount = deck.filter(c => c.flipped).length;
    if (flippedCount > 1) {
        score = Math.max(100, score - 100);
    }

    actionHistory.push(deck[index].isLie ? '🟥' : '🟩');
    setStatus(flippedCount === 1 ? "FIRST FLIP FREE! WATCH FOR LIES." : "CLUE REVEALED (-100 PTS).");
    
    renderCards();
    updateHUD();
}

function burnCard(event, index) {
    event.stopPropagation();
    if (gameOver || burnsLeft <= 0 || deck[index].burned) return;

    burnsLeft--;
    deck[index].burned = true;
    triggerShake();

    if (deck[index].isLie) {
        score += 150;
        actionHistory.push('🔥');
        spawnParticles(event.clientX, event.clientY, '#ffaa00');
        setStatus("DIRECT HIT! YOU BURNED A SMOKESCREEN (+150 PTS)!", "#2ce865");
    } else {
        score = Math.max(50, score - 150);
        actionHistory.push('💀');
        spawnParticles(event.clientX, event.clientY, '#ff2a55');
        setStatus("OUCH! THAT WAS A REAL CLUE (-150 PTS)!", "#ff2a55");
    }

    renderCards();
    updateHUD();
}

function submitGuess() {
    if (gameOver) return;
    const input = document.getElementById('guess-input');
    const guess = input.value.trim().toUpperCase();
    if (!guess) return;

    const validAnswers = [currentPuzzle.answer, ...currentPuzzle.aliases];

    if (validAnswers.includes(guess)) {
        actionHistory.push('🎯');
        endRound(true);
    } else {
        guessesLeft--;
        score = Math.max(50, score - 200);
        actionHistory.push('❌');
        triggerShake();
        input.value = '';
        updateHUD();

        if (guessesLeft <= 0) {
            endRound(false);
        } else {
            setStatus(`WRONG GUESS! ${guessesLeft} ATTEMPTS LEFT (-200 PTS).`, "#ff2a55");
        }
    }
}

function endRound(won) {
    gameOver = true;
    document.getElementById('guess-input').disabled = true;

    // Reveal all remaining cards
    deck.forEach(c => c.flipped = true);
    renderCards();

    if (currentMode === 'daily') {
        const dayIdx = getDayIndex();
        localStorage.setItem('smokescreen_daily_done', String(dayIdx));
        
        if (won) {
            const streak = parseInt(localStorage.getItem('smokescreen_streak') || '0', 10) + 1;
            localStorage.setItem('smokescreen_streak', String(streak));
        } else {
            localStorage.setItem('smokescreen_streak', '0');
        }
        checkArcadeUnlock();
        updateHUD();
    }

    // Show End Modal
    const modal = document.getElementById('end-modal');
    const content = modal.querySelector('.modal-content');
    content.classList.toggle('lost', !won);

    document.getElementById('modal-title').innerText = won ? "SMOKESCREEN CLEARED!" : "FOOLED BY THE SMOKE";
    document.getElementById('modal-answer').innerText = currentPuzzle.answer;
    document.getElementById('emoji-grid').innerText = actionHistory.join(' ');
    document.getElementById('modal-stats').innerText = won 
        ? `FINAL SCORE: ${score} PTS` 
        : `BETTER LUCK NEXT ROUND`;

    modal.classList.remove('hidden');
}

// --- UI HELPERS & VISUAL FX ---
function updateHUD() {
    document.getElementById('hud-score').innerText = score;
    document.getElementById('hud-guesses').innerText = guessesLeft;
    document.getElementById('hud-burns').innerText = burnsLeft;
    document.getElementById('hud-streak').innerText = localStorage.getItem('smokescreen_streak') || '0';
}

function setStatus(msg, color = "#00f0ff") {
    const banner = document.getElementById('status-banner');
    banner.style.color = color;
    banner.style.borderLeftColor = color;
    banner.innerText = msg;
}

function triggerShake() {
    const wrapper = document.getElementById('game-wrapper');
    wrapper.classList.remove('shake');
    void wrapper.offsetWidth; // Force reflow
    wrapper.classList.add('shake');
}

function spawnParticles(x, y, color) {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'pixel-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.backgroundColor = color;

        const angle = (Math.PI * 2 * i) / 12;
        const dist = 30 + Math.random() * 40;
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);

        container.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function copyShareText() {
    const dayNum = document.getElementById('daily-number').innerText;
    const header = currentMode === 'daily' ? `SMOKESCREEN #${dayNum}` : `SMOKESCREEN ARCADE`;
    const text = `${header}\n${actionHistory.join('')}\nScore: ${score}`;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-share');
        btn.innerText = "✅ COPIED!";
        setTimeout(() => btn.innerText = "📋 COPY RESULT", 2000);
    });
}
