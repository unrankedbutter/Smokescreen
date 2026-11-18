const PUZZLE_BANK = [
    { answer: "MICROWAVE", aliases: ["MICROWAVE OVEN"], clues: ["I spin contents in a circle while working.", "I have a windowed door that lets you watch.", "I beep loudly when finished.", "I live on kitchen counters.", "Metal objects inside me cause sparks.", "I reheat leftovers in seconds."] },
    { answer: "CACTUS", aliases: ["CACTI"], clues: ["I store water inside my thick green body.", "Touching me without gloves is painful.", "I thrive in scorching desert climates.", "People keep tiny versions on windowsills.", "I rarely need watering.", "I bloom bright flowers."] },
    { answer: "COMPASS", aliases: ["MAGNETIC COMPASS"], clues: ["My needle constantly points north.", "Hikers rely on me when GPS fails.", "I react to Earth's magnetic field.", "I have N, S, E, W on my face.", "Holding a magnet ruins my accuracy.", "I fit inside a pocket."] },
    { answer: "PIANO", aliases: ["GRAND PIANO", "KEYBOARD"], clues: ["I have 88 black and white keys.", "Felt hammers strike my metal strings inside.", "I usually have three pedals underneath.", "Classical masters played me.", "Moving me requires a heavy crew.", "I make music without wall power."] },
    { answer: "SUBMARINE", aliases: ["SUB"], clues: ["I operate deep underwater beneath waves.", "I have a periscope to scan horizons.", "I use ballast tanks to submerge and surface.", "Naval officers live inside me for months.", "Sonar helps me navigate in total darkness.", "I am powered by nuclear reactors."] },
    { answer: "TELESCOPE", aliases: ["SPYGLASS"], clues: ["I make distant stars and planets look closer.", "I use curved glass lenses or large mirrors.", "Astronomers mount me in high altitude observatories.", "You peer through my eyepiece at night.", "I helped discover distant galaxies.", "I sit on a sturdy tripod."] },
    { answer: "CHAMELEON", aliases: ["LIZARD"], clues: ["I change my skin color to match surroundings.", "My eyes can look in two different directions at once.", "I catch insects with a lightning-fast sticky tongue.", "I live high up in tropical trees.", "I have a prehensile tail for gripping branches.", "I move very slowly and cautiously."] },
    { answer: "ESPRESSO MACHINE", aliases: ["COFFEE MAKER", "ESPRESSO"], clues: ["I force hot water through tight coffee grounds.", "I brew concentrated shots with golden crema on top.", "I have a steam wand to froth milk for lattes.", "I hiss and rumble during operation.", "I live on café counters everywhere.", "I wake people up every morning."] },
    { answer: "LIGHTHOUSE", aliases: ["BEACON"], clues: ["I stand tall on rocky shorelines to guide ships.", "I flash a powerful beam of light out to sea.", "Keepers historically lived inside my base.", "I warn sailors away from dangerous shallow reefs.", "My top houses a giant rotating lens.", "I weather heavy coastal storms."] },
    { answer: "HOURGLASS",aliases: ["SANDGLASS", "TIMER"], clues: ["I measure short spans of time using falling powder.", "I consist of two connected glass bulbs.", "You have to flip me upside down to restart.", "I contain thousands of tiny grains of quartz.", "I am completely silent while running.", "Board games often use me."] },
    { answer: "GRAMOPHONE", aliases: ["RECORD PLAYER", "TURNTABLE"], clues: ["I play analog sound from vinyl discs.", "I feature a large metal acoustic horn.", "A tiny diamond needle rides my spinning grooves.", "You have to wind up my spring motor.", "I bring vintage music to life.", "I spin at 33 or 45 RPM."] },
    { answer: "TYPEWRITER", aliases: ["KEYBOARD"], clues: ["I stamp ink characters directly onto paper sheets.", "Every keystroke flips a physical metal hammer.", "I have a noisy return lever for new lines.", "Authors and reporters used me for decades.", "My ribbons require ink replacement.", "I make a satisfying clacking rhythm."] },
    { answer: "HOT AIR BALLOON", aliases: ["BALLOON"], clues: ["I float gracefully through the open sky.", "A massive propane burner heats air inside my envelope.", "Passengers ride inside a woven wicker basket.", "I drift wherever the wind carries me.", "I launch during early morning calm weather.", "I require a ground chase crew."] },
    { answer: "SNOWGLOBE", aliases: ["SNOW GLOBE"], clues: ["I feature a miniature scene enclosed in glass.", "Shaking me creates a blizzard of white flakes.", "I sit on winter holiday shelves.", "Water suspends my floating glitter snow.", "I often play a music box tune underneath.", "I capture cozy memories."] },
    { answer: "HARMONICA", aliases: ["MOUTH ORGAN"], clues: ["I fit entirely inside your hands or pocket.", "You play me by blowing and drawing air through slots.", "Metal reeds vibrate inside my comb channels.", "Blues and folk musicians love my sound.", "I require zero electrical cables.", "I have distinct numbered holes."] },
    { answer: "BINOCULARS", aliases: ["FIELD GLASSES"], clues: ["I give magnified stereoscopic vision for both eyes.", "You adjust my central focus wheel to sharpen sights.", "Bird watchers and sports fans wear me around necks.", "I combine two side-by-side refracting scopes.", "I fold to fit your eye width.", "I reveal distant details."] },
    { answer: "PINATA", aliases: ["PARTY PINATA"], clues: ["I am a hollow paper-mâché figure packed with treats.", "Party guests take turns striking me blindfolded.", "I burst open to shower candy everywhere.", "I hang from tree branches or ceilings.", "I am decorated in bright colorful tissue paper.", "Birthday celebrations feature me."] },
    { answer: "LANTERN", aliases: ["OIL LANTERN"], clues: ["I provide portable light enclosed in glass panels.", "A fabric wick draws fuel from a lower basin.", "Campers and hikers carry me after dark.", "I protect an open flame from wind gusts.", "I have a metal hanging bail handle.", "I give off a warm glowing ambiance."] },
    { answer: "STETHOSCOPE", aliases: ["DOCTOR SCOPE"], clues: ["I let medical professionals listen to heartbeats.", "I feature rubber tubing connected to earpieces.", "My chest piece uses a diaphragm resonator.", "Doctors wear me draped around their necks.", "I amplify subtle internal lung sounds.", "I diagnose patient conditions."] },
    { answer: "METRONOME", aliases: ["TEMPO KEEPER"], clues: ["I keep strict musical timing with a swinging pendulum.", "I tick back and forth at precise BPM speeds.", "Musicians practice alongside my steady beat.", "You slide my weighted pendulum up or down.", "I have an audible mechanical click.", "Piano teachers keep me on hand."] }
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
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
    osc.start(now); osc.stop(now + 0.04);
}

function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'flip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'burn_lie') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'burn_truth') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.setValueAtTime(440, now + 0.1);
        osc.frequency.setValueAtTime(580, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
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
    document.getElementById('menu-daily-num').innerText = (dayIdx % PUZZLE_BANK.length) + 1;
    const streakVal = localStorage.getItem('smokescreen_streak') || '0';
    const winsVal = localStorage.getItem('smokescreen_wins') || '0';

    document.getElementById('menu-streak').innerText = streakVal;
    document.getElementById('acc-streak').innerText = streakVal;
    document.getElementById('acc-wins').innerText = winsVal;

    const isDailyDone = localStorage.getItem('smokescreen_daily_done') === String(dayIdx);
    const dailyBtn = document.getElementById('btn-play-daily');
    if (isDailyDone) {
        dailyBtn.classList.add('locked');
        dailyBtn.querySelector('.btn-title').innerText = "Daily Completed";
        dailyBtn.querySelector('.btn-sub').innerText = "Come back tomorrow for new puzzle";
    }
}

function checkAuthSession() {
    const user = localStorage.getItem('smokescreen_user');
    if (user) {
        document.getElementById('profile-name').innerText = user;
        document.getElementById('auth-logged-out').classList.add('hidden');
        document.getElementById('auth-logged-in').classList.remove('hidden');
    } else {
        document.getElementById('auth-logged-out').classList.remove('hidden');
        document.getElementById('auth-logged-in').classList.add('hidden');
    }
}

function handleLogin() {
    const user = document.getElementById('auth-user-input').value.trim();
    if (!user) { alert("Enter username."); return; }
    localStorage.setItem('smokescreen_user', user);
    checkAuthSession();
    closeModal('account-modal');
}

function handleLogout() {
    localStorage.removeItem('smokescreen_user');
    checkAuthSession();
    closeModal('account-modal');
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function toggleInstructions(show) { document.getElementById('instructions-modal').classList.toggle('hidden', !show); }

function toggleAudio() {
    soundEnabled = !soundEnabled;
    document.getElementById('audio-icon').innerText = soundEnabled ? "🔊" : "🔇";
}

function toggleTheme() {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
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
        alert("Daily already finished today! Try Arcade mode.");
        return;
    }
    currentMode = 'daily';
    const puzzleObj = PUZZLE_BANK[dayIdx % PUZZLE_BANK.length];
    setupBoard(puzzleObj, mulberry32(dayIdx + 99), `DAILY #${(dayIdx % PUZZLE_BANK.length) + 1}`, 2);
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
    setStatus("Dealt! Tap cards to inspect clues.");
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
            bottomAction = `<button class="burn-action-btn" onclick="burnCard(event, ${index})">Burn Lie</button>`;
        } else if (card.burned) {
            bottomAction = `<div style="font-size:11px; font-weight:700; color:var(--danger)">Purged</div>`;
        }

        slot.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <span class="card-num">#0${index + 1}</span>
                    <span class="card-q">?</span>
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
    spawnParticles(event.clientX || window.innerWidth/2, event.clientY || window.innerHeight/2, '#38bdf8');
    const activeFlips = deck.filter(c => c.flipped && !c.burned).length;
    if (activeFlips > 1) score = Math.max(100, score - 80);
    setStatus(activeFlips === 1 ? "First inspection is free!" : "Clue inspected (-80 pts).");
    renderCards(); updateHUD();
}

function burnCard(event, index) {
    event.stopPropagation();
    if (gameOver || burnsLeft <= 0 || deck[index].burned) return;
    burnsLeft--; deck[index].burned = true; deck[index].burning = true;

    if (deck[index].isLie) {
        score += 200; liesCaught++;
        playSound('burn_lie');
        spawnParticles(event.clientX, event.clientY, '#34d399');
        setStatus("Smokescreen purged successfully (+200 pts)!", "var(--success)");
    } else {
        score = Math.max(50, score - 200);
        playSound('burn_truth');
        spawnParticles(event.clientX, event.clientY, '#f87171');
        setStatus("Mistake! Purged a real clue (-200 pts)!", "var(--danger)");
    }
    renderCards();
    setTimeout(() => { deck[index].removed = true; renderCards(); }, 450);
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
        input.value = ''; updateHUD();
        if (guessesLeft <= 0) endRound(false);
        else setStatus(`Incorrect! ${guessesLeft} tries left (-200 pts).`, "var(--danger)");
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
    document.getElementById('modal-title').innerText = won ? "Case Solved!" : "Investigation Failed";
    document.getElementById('modal-answer').innerText = currentPuzzle.answer;
    document.getElementById('end-final-score').innerText = `${score} PTS`;
    document.getElementById('rank-badge').innerText = `RANK: ${rank}`;
    document.getElementById('modal-stats').innerText = won ? `Flips: ${flipsCount} • Lies caught: ${liesCaught}` : `Target escaped.`;
    modal.classList.remove('hidden');
}

function updateHUD() {
    document.getElementById('hud-score').innerText = score;
    document.getElementById('hud-guesses').innerText = guessesLeft;
    document.getElementById('hud-burns').innerText = burnsLeft;
    document.getElementById('hud-time').innerText = timeLeft + 's';
    document.getElementById('timer-fill').style.width = `${(timeLeft / 45) * 100}%`;
}

function setStatus(msg, color = "") {
    const banner = document.getElementById('status-banner');
    banner.style.borderLeftColor = color || 'var(--primary)';
    banner.innerText = msg;
}

function spawnParticles(x, y, color) {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'pixel-particle';
        p.style.left = `${x}px`; p.style.top = `${y}px`;
        p.style.backgroundColor = color;
        const angle = (Math.PI * 2 * i) / 10, dist = 30 + Math.random() * 30;
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        container.appendChild(p);
        setTimeout(() => p.remove(), 400);
    }
}

function copyShareText() {
    navigator.clipboard.writeText(`SMOKESCREEN | Score: ${score} PTS`).then(() => {
        const btn = document.getElementById('btn-share');
        btn.innerText = "Copied!";
        setTimeout(() => btn.innerText = "Copy Score", 2000);
    });
}
