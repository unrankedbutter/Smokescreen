:root[data-theme="dark"] {
    --bg-void: #060810;
    --bg-card: #0f1322;
    --bg-card-hover: #161b2e;
    --border-color: #1e263f;
    --accent-cyan: #00f0ff;
    --accent-green: #10b981;
    --accent-red: #ef4444;
    --accent-amber: #f59e0b;
    --accent-purple: #8b5cf6;
    --text-main: #f8fafc;
    --text-dim: #94a3b8;
}

:root[data-theme="light"] {
    --bg-void: #d8e2ec;
    --bg-card: #ffffff;
    --bg-card-hover: #f1f5f9;
    --border-color: #cbd5e1;
    --accent-cyan: #0284c7;
    --accent-green: #059669;
    --accent-red: #dc2626;
    --accent-amber: #d97706;
    --accent-purple: #7c3aed;
    --text-main: #0f172a;
    --text-dim: #64748b;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

body {
    background-color: var(--bg-void);
    color: var(--text-main);
    font-family: 'Fredoka', sans-serif;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    background-image: 
        linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    transition: background-color 0.3s ease;
}

.crt-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 999;
    background: linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.04) 50%);
    background-size: 100% 4px;
}

.game-wrapper {
    width: 100%;
    max-width: 960px;
    padding: 20px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Top Navbar */
.top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background: var(--bg-card);
    border: 3px solid var(--accent-cyan);
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
}

.nav-brand {
    font-family: 'Press Start 2P', monospace;
    font-size: 13px;
    color: var(--accent-cyan);
    cursor: pointer;
    text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
}

.nav-actions {
    display: flex;
    gap: 10px;
}

.screen {
    display: none;
    flex-direction: column;
    gap: 20px;
    animation: screenFadeIn 0.25s ease-out;
}

.screen.active-screen {
    display: flex;
}

@keyframes screenFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
}

/* Krillion Centered Dive Layout */
.hero-section {
    text-align: center;
    padding: 24px 0 10px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.hero-title {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(28px, 6vw, 46px);
    color: var(--accent-cyan);
    text-shadow: 4px 4px 0px var(--accent-red), -2px -2px 0px #000;
    letter-spacing: 3px;
}

.hero-subtitle {
    font-family: 'Press Start 2P', monospace;
    font-size: 14px;
    color: var(--text-main);
    letter-spacing: 2px;
}

.hero-subtext {
    color: var(--text-dim);
    font-size: 15px;
    font-weight: 600;
}

.krillion-deck-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
}

.btn-hero {
    background: var(--bg-card);
    border: 3px solid var(--accent-cyan);
    border-radius: 12px;
    padding: 22px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 0 25px rgba(0, 240, 255, 0.12), inset 0 0 15px rgba(0, 240, 255, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
}

.btn-hero:hover {
    transform: translateY(-4px);
    border-color: var(--accent-green);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.25);
}

.daily-hero-btn {
    border-color: var(--accent-cyan);
}

.arcade-hero-btn {
    border-color: var(--accent-purple);
    box-shadow: 0 0 25px rgba(139, 92, 246, 0.12);
}

.arcade-hero-btn:hover {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.25);
}

.sub-indicator {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    color: var(--text-dim);
}

.hero-btn-text {
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: var(--text-main);
    text-shadow: 2px 2px 0px rgba(0,0,0,0.6);
}

.krillion-footer-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    font-size: 15px;
    color: var(--text-dim);
    margin-top: 10px;
    font-weight: 600;
}

.link-btn {
    background: none;
    border: none;
    color: var(--accent-cyan);
    font-family: 'Fredoka', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
}

.link-btn:hover {
    color: var(--text-main);
}

/* Arcade Buttons */
.arcade-btn {
    font-family: 'Fredoka', sans-serif;
    font-weight: 700;
    font-size: 14px;
    padding: 10px 18px;
    background: var(--bg-card);
    color: var(--text-main);
    border: 2px solid var(--border-color);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 4px 0 rgba(0,0,0,0.15);
}

.arcade-btn:hover {
    background: var(--bg-card-hover);
    border-color: var(--accent-cyan);
    transform: translateY(-2px);
}

.arcade-btn:active {
    transform: translateY(2px);
    box-shadow: 0 0 0 rgba(0,0,0,0.15);
}

.btn-action {
    background: var(--accent-green);
    color: #fff;
    border-color: #059669;
    font-size: 15px;
    padding: 14px;
    width: 100%;
    border-radius: 12px;
}

.btn-sm {
    font-size: 12px;
    padding: 8px 14px;
}

.btn-danger {
    background: var(--accent-red);
    color: #fff;
    border-color: #991b1b;
    width: 100%;
    padding: 12px;
}

/* Game Header & HUD */
.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-card);
    padding: 12px 18px;
    border: 2px solid var(--border-color);
    border-radius: 14px;
}

.game-badge {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    color: var(--accent-cyan);
}

.timer-bar-container {
    width: 100%;
    height: 10px;
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 6px;
    overflow: hidden;
}

.timer-fill {
    width: 100%;
    height: 100%;
    background: var(--accent-cyan);
    transition: width 1s linear, background 0.3s;
}

.hud-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.hud-box {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 10px;
    text-align: center;
}

.hud-title {
    display: block;
    font-size: 12px;
    color: var(--text-dim);
    font-weight: 600;
}

.hud-val {
    font-family: 'Press Start 2P', monospace;
    font-size: 14px;
    color: var(--accent-amber);
    margin-top: 4px;
    display: block;
}

.status-banner {
    background: var(--bg-card);
    border-left: 5px solid var(--accent-cyan);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 18px;
    font-weight: 600;
    color: var(--accent-cyan);
    min-height: 52px;
    display: flex;
    align-items: center;
}

/* Symmetrical Card Grid */
.card-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    perspective: 1200px;
    min-height: 400px;
    padding: 10px 0;
}

.card-slot {
    width: calc(25% - 12px);
    height: 195px;
    position: relative;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.2, 0.85, 0.3, 1.15);
}

@media (max-width: 768px) {
    .card-slot {
        width: calc(50% - 8px);
    }
}

.card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.4s cubic-bezier(0.2, 0.85, 0.3, 1.15);
}

.card-slot.flipped .card-inner {
    transform: rotateY(180deg);
}

.card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border: 2px solid var(--border-color);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    text-align: center;
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}

.card-back {
    background: var(--bg-card);
    background-image: repeating-linear-gradient(
        45deg,
        var(--bg-void),
        var(--bg-void) 10px,
        var(--bg-card) 10px,
        var(--bg-card) 20px
    );
    transition: border-color 0.2s, transform 0.2s ease;
}

.card-slot:not(.flipped):hover .card-back {
    border-color: var(--accent-cyan);
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 240, 255, 0.15);
}

.card-number {
    font-family: 'Press Start 2P', monospace;
    font-size: 13px;
    color: var(--text-dim);
}

.card-qmark {
    font-size: 32px;
    color: var(--border-color);
    margin-top: 8px;
}

.card-front {
    background: var(--bg-card-hover);
    border-color: var(--border-color);
    transform: rotateY(180deg);
    justify-content: space-between;
}

.clue-text {
    font-size: 17px;
    line-height: 1.35;
    color: var(--text-main);
    font-weight: 600;
    margin: auto 0;
}

.burn-btn {
    font-family: 'Fredoka', sans-serif;
    font-weight: 700;
    font-size: 12px;
    background: #fee2e2;
    color: var(--accent-red);
    border: 2px solid #f87171;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    width: 100%;
    transition: background 0.15s;
}

:root[data-theme="dark"] .burn-btn {
    background: #450a0a;
    border-color: var(--accent-red);
}

.burn-btn:hover {
    background: var(--accent-red);
    color: #fff;
}

/* Flame Particle Burning Animation */
.card-slot.is-burning {
    animation: realFlameBurn 0.6s ease-in-out forwards !important;
    pointer-events: none;
}

@keyframes realFlameBurn {
    0% { transform: scale(1) rotate(0deg); filter: brightness(1); }
    30% { transform: scale(1.1) rotate(4deg); filter: brightness(2.5) sepia(1) saturate(8) hue-rotate(-30deg); }
    70% { transform: scale(0.6) translateY(20px) rotate(-10deg); opacity: 0.8; filter: brightness(3.5); }
    100% { transform: scale(0.1) translateY(40px) rotate(20deg); opacity: 0; width: 0; margin: 0; padding: 0; border: none; }
}

/* Guess Input */
.guess-container {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 14px;
    padding: 14px;
}

.input-wrapper {
    display: flex;
    gap: 12px;
}

input[type="text"], .auth-input {
    flex: 1;
    background: var(--bg-void);
    border: 2px solid var(--border-color);
    color: var(--text-main);
    font-family: 'Fredoka', sans-serif;
    font-weight: 600;
    font-size: 16px;
    padding: 14px 18px;
    border-radius: 10px;
    outline: none;
    text-transform: uppercase;
    transition: border-color 0.2s;
}

input[type="text"]:focus, .auth-input:focus {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.btn-submit {
    background: var(--accent-cyan);
    color: #0f172a;
    border-color: #0284c7;
    font-weight: 700;
    padding: 0 24px;
    border-radius: 10px;
}

/* Modals */
.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 20px;
}

.modal.hidden { display: none; }

.modal-card {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 18px;
    width: 100%;
    max-width: 440px;
    padding: 28px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow: 0 16px 32px rgba(0,0,0,0.2);
}

.modal-card h2 {
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: var(--text-main);
}

.modal-sub {
    color: var(--text-dim);
    font-size: 15px;
}

.difficulty-list, .settings-list, .auth-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.diff-btn {
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    font-size: 16px;
    font-weight: 600;
}

.sub-tag {
    font-size: 12px;
    background: rgba(0,0,0,0.1);
    padding: 4px 8px;
    border-radius: 6px;
}

.google-btn {
    background: #ffffff;
    color: #1e293b;
    border-color: #cbd5e1;
    font-weight: 600;
    width: 100%;
}

.auth-divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--text-dim);
    font-size: 13px;
    margin: 4px 0;
}

.auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--border-color);
}

.auth-divider::before { margin-right: 10px; }
.auth-divider::after { margin-left: 10px; }

.profile-pill {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--bg-void);
    padding: 14px;
    border-radius: 12px;
    border: 2px solid var(--border-color);
    text-align: left;
}

#profile-avatar { font-size: 28px; }
.profile-status { font-size: 12px; color: var(--accent-green); font-weight: 600; }

.profile-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.p-stat {
    background: var(--bg-void);
    border: 2px solid var(--border-color);
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    color: var(--text-dim);
}

.p-stat strong {
    font-size: 16px;
    color: var(--text-main);
}

.shop-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.shop-item {
    background: var(--bg-void);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.item-icon { font-size: 28px; }
.shop-item h4 { font-size: 15px; }
.shop-item span { font-size: 12px; color: var(--accent-amber); font-weight: 600; }

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
}

.instructions-body {
    text-align: left;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--text-dim);
    line-height: 1.4;
}

.instructions-body strong { color: var(--text-main); }

.btn-close {
    width: 100%;
    background: var(--bg-void);
    border-color: var(--border-color);
}

/* End Round Modal */
.end-card { padding: 32px 24px; }
.end-icon { font-size: 36px; }

.score-banner {
    background: var(--bg-void);
    border: 2px solid var(--border-color);
    padding: 16px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.s-label { font-size: 13px; color: var(--text-dim); font-weight: 600; }
.s-value {
    font-family: 'Press Start 2P', monospace;
    font-size: 20px;
    color: var(--accent-green);
}

.rank-badge {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    color: var(--accent-amber);
    margin-top: 4px;
}

.reveal-box {
    background: var(--bg-void);
    border: 2px solid var(--border-color);
    padding: 12px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    color: var(--text-dim);
}

.reveal-box strong {
    font-family: 'Press Start 2P', monospace;
    font-size: 18px;
    color: var(--accent-amber);
}

.modal-stats { font-size: 15px; color: var(--text-dim); }
.modal-actions { display: flex; gap: 10px; justify-content: center; }

.pixel-particle {
    position: fixed;
    width: 10px;
    height: 10px;
    pointer-events: none;
    z-index: 998;
    animation: particleBurst 0.5s ease-out forwards;
}

@keyframes particleBurst {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0) rotate(180deg); opacity: 0; }
}
