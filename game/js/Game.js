import Player from './Player.js';
import Statue from './Statue.js';
import Guard from './Guard.js';
import InputHandler from './InputHandler.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.input = new InputHandler();

        this.gameState = 'MENU'; // MENU, PLAYING, GAMEOVER, LEVEL_TRANSITION
        this.level = 1;
        this.lives = 3;

        // Entities
        this.statue = null;
        this.player = null;
        this.guards = [];
        this.projectiles = [];

        this.lastTime = 0;
        this.animationId = null;

        // Load Asset Images
        this.assets = {
            background: new Image(),
            projectile: new Image(),
        };
        this.assets.background.src = 'assets/wallpaper.png';
        this.assets.projectile.src = 'assets/projectile.png';
    }

    start() {
        this.level = 1;
        this.lives = 3;
        this.startTime = Date.now();
        this.loadLevel(this.level);
        this.gameState = 'PLAYING';
        this.updateUI();

        this.lastTime = 0;
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.loop(0);
    }

    loadLevel(level) {
        // Reset entities
        this.projectiles = [];
        this.guards = [];

        // Setup Statue
        // Statue gets bigger or more health per level
        // Statue HP adjusted for difficulty curve
        let statueHealth = 100 * level;
        if (level === 1) statueHealth = 60;  // Easier Level 1
        if (level === 2) statueHealth = 100; // Easier Level 2
        if (level === 3) statueHealth = 150;
        this.statue = new Statue(this, statueHealth);

        // Setup Player
        this.player = new Player(this);

        // Setup Guards
        let guardCount = 1 + level; // Level 1: 2 guards, Level 2: 3, Level 3: 4..
        if (level === 1) guardCount = 2; // Override for simplicity
        if (level === 2) guardCount = 4;
        if (level === 3) guardCount = 6;

        for (let i = 0; i < guardCount; i++) {
            this.guards.push(new Guard(this));
        }
    }

    update(deltaTime) {
        if (this.gameState !== 'PLAYING') return;

        this.statue.update(deltaTime);
        this.player.update(deltaTime);

        this.guards.forEach(guard => guard.update(deltaTime));
        this.projectiles.forEach((proj, index) => {
            proj.update(deltaTime);
            if (proj.markedForDeletion) {
                this.projectiles.splice(index, 1);
            }
        });

        // Check Win Condition
        if (this.statue.currentHealth <= 0) {
            if (this.level < 3) {
                // Level Complete Transition
                this.gameState = 'LEVEL_TRANSITION';

                const score = this.getCurrentScore();
                const shareText = `¡Nivel ${this.level} superado en Derriba al Galáctico! Puntuación: ${score}. #DerribaAlGaláctico #VenezuelaLibre`;
                const shareUrl = window.location.href;

                document.getElementById('level-score-display').innerText = `Puntuación actual: ${score}`;

                // Level Share Buttons
                const xBtnLevel = document.getElementById('share-level-x');
                xBtnLevel.onclick = () => {
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                    window.open(url, '_blank');
                };

                const fbBtnLevel = document.getElementById('share-level-fb');
                fbBtnLevel.onclick = () => {
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
                    window.open(url, '_blank');
                };

                document.getElementById('level-screen').classList.remove('hidden');
                document.getElementById('level-screen').classList.add('active');
                // Loop stops automatically because gameState != PLAYING
            } else {
                this.gameOver(true); // Victory
            }
            this.updateUI();
        }

        if (this.lives <= 0) {
            this.gameOver(false);
        }
    }

    getCurrentScore() {
        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - this.startTime) / 1000);
        let score = (this.level * 1000) - (durationSeconds * 10);
        return Math.max(0, score);
    }

    nextLevel() {
        this.level++;
        this.loadLevel(this.level);
        document.getElementById('level-screen').classList.remove('active');
        document.getElementById('level-screen').classList.add('hidden');
        this.gameState = 'PLAYING';
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Background wallpaper
        if (this.assets.background.complete) {
            // Scale background to cover edges, stretching more vertically
            const scaleX = 1.3;
            const scaleY = 1.1;
            const scaledW = this.width * scaleX;
            const scaledH = this.height * scaleY;
            const offsetX = (this.width - scaledW) / 2; //(this.width - scaledW) / 2;
            const offsetY = 0; //(this.height - scaledH) / 2 + 80; // Shift down
            this.ctx.drawImage(this.assets.background, offsetX, offsetY, scaledW, scaledH);
        } else {
            // Fallback while image loads
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Draw Ground Strip (Brown zone for guards)
        //this.ctx.fillStyle = '#5D4037'; // Earthy brown
        //this.ctx.fillRect(0, this.height - 40, this.width, 40);

        this.statue.draw(this.ctx);
        this.player.draw(this.ctx);

        this.guards.forEach(guard => guard.draw(this.ctx));
        this.projectiles.forEach(proj => proj.draw(this.ctx));
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        if (this.gameState === 'PLAYING') {
            this.animationId = requestAnimationFrame(this.loop.bind(this));
        }
    }

    gameOver(win) {
        this.gameState = 'GAMEOVER';
        const msg = win ? "¡Victoria! ¡La tiranía ha caído!" : "Como a los +1000 presos políticos que hay en Venezuela";

        let score = this.getCurrentScore();
        if (win) score += 5000; // Bonus for winning

        document.getElementById('game-over-msg').innerText = msg;
        document.getElementById('score-display').innerText = `Puntuación Final: ${score}`;

        // Setup Share
        let shareText = '';
        if (win) {
            shareText = `¡VICTORIA! He derrocado al régimen con ${score} puntos en Derriba al Galáctico. ¡Viva Venezuela Libre! #DerribaAlGalactico`;
        } else {
            shareText = `El régimen me ha capturado en el nivel ${this.level} con ${score} puntos. ¡La lucha continúa! #DerribaAlGalactico`;
        }
        const shareUrl = window.location.href;

        // Game Over Share Buttons
        const xBtn = document.getElementById('share-x');
        xBtn.onclick = () => {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(url, '_blank');
        };

        const fbBtn = document.getElementById('share-fb');
        fbBtn.onclick = () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
            window.open(url, '_blank');
        };

        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('game-over-screen').classList.add('active');
    }

    updateUI() {
        // Heart emojis: Yellow, Blue, Red
        const hearts = ['💛', '💙', '❤️'];
        // Show hearts based on remaining lives. 3 lives = all 3. 2 lives = first 2, etc.
        const heartsString = hearts.slice(0, Math.max(0, this.lives)).join(' ');

        document.getElementById('lives-display').innerText = heartsString;
        document.getElementById('level-display').innerText = this.level;
        if (this.statue) {
            const pct = Math.max(0, (this.statue.currentHealth / this.statue.maxHealth) * 100);
            document.getElementById('health-bar-fill').style.width = pct + '%';
        }
    }
}
