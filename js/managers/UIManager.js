/**
 * UIManager.js
 * User interface manager.
 * Centralizes all DOM interactions.
 */

import eventBus, { GAME_EVENTS } from '../core/EventBus.js';
import { UI_CONFIG } from '../config/GameConfig.js';

export default class UIManager {
    constructor() {
        this.elements = {
            // Screens
            startScreen: document.getElementById('start-screen'),
            levelScreen: document.getElementById('level-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            
            // Buttons
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            nextLevelBtn: document.getElementById('next-level-btn'),
            
            // Displays
            livesDisplay: document.getElementById('lives-display'),
            levelDisplay: document.getElementById('level-display'),
            healthBarFill: document.getElementById('health-bar-fill'),
            scoreDisplay: document.getElementById('score-display'),
            levelScoreDisplay: document.getElementById('level-score-display'),
            gameOverMsg: document.getElementById('game-over-msg'),
            
            // Share Buttons
            shareX: document.getElementById('share-x'),
            shareFb: document.getElementById('share-fb'),
            shareLevelX: document.getElementById('share-level-x'),
            shareLevelFb: document.getElementById('share-level-fb')
        };

        this.setupEventListeners();
    }

    /**
     * Setup internal UI listeners
     */
    setupEventListeners() {
        // Listen to game events
        eventBus.on(GAME_EVENTS.LIVES_UPDATE, (data) => {
            this.updateLives(data.lives);
        });

        eventBus.on(GAME_EVENTS.HEALTH_UPDATE, (data) => {
            this.updateHealth(data.current, data.max);
        });

        eventBus.on(GAME_EVENTS.LEVEL_START, (data) => {
            this.updateLevel(data.level);
        });
    }

    /**
     * Update lives display
     * @param {number} lives
     */
    updateLives(lives) {
        const heartsString = UI_CONFIG.HEARTS
            .slice(0, Math.max(0, lives))
            .join(' ');
        this.elements.livesDisplay.innerText = heartsString;
    }

    /**
     * Update level display
     * @param {number} level
     */
    updateLevel(level) {
        this.elements.levelDisplay.innerText = level;
    }

    /**
     * Update health bar
     * @param {number} current - Current health
     * @param {number} max - Maximum health
     */
    updateHealth(current, max) {
        const percentage = Math.max(0, (current / max) * 100);
        this.elements.healthBarFill.style.width = percentage + '%';
    }

    /**
     * Update score
     * @param {number} score
     * @param {boolean} isFinal
     */
    updateScore(score, isFinal = false) {
        const element = isFinal ? this.elements.scoreDisplay : this.elements.levelScoreDisplay;
        const prefix = isFinal ? 'Final Score: ' : 'Current Score: ';
        element.innerText = prefix + score;
    }

    /**
     * Show start screen
     */
    showStartScreen() {
        this.hideAll();
        this.show(this.elements.startScreen);
    }

    /**
     * Show level transition screen
     * @param {number} score
     */
    showLevelScreen(score) {
        this.hideAll();
        this.updateScore(score, false);
        this.show(this.elements.levelScreen);
    }

    /**
     * Show game over screen
     * @param {boolean} win
     * @param {number} score
     */
    showGameOverScreen(win, score) {
        this.hideAll();
        const message = win ? UI_CONFIG.MESSAGES.VICTORY : UI_CONFIG.MESSAGES.DEFEAT;
        this.elements.gameOverMsg.innerText = message;
        this.updateScore(score, true);
        this.show(this.elements.gameOverScreen);
    }

    /**
     * Hide all screens
     */
    hideAll() {
        [this.elements.startScreen, this.elements.levelScreen, this.elements.gameOverScreen]
            .forEach(screen => this.hide(screen));
    }

    /**
     * Show an element
     * @param {HTMLElement} element
     */
    show(element) {
        if (element) {
            element.classList.remove('hidden');
            element.classList.add('active');
        }
    }

    /**
     * Hide an element
     * @param {HTMLElement} element
     */
    hide(element) {
        if (element) {
            element.classList.remove('active');
            element.classList.add('hidden');
        }
    }

    /**
     * Setup share buttons
     * @param {string} type - 'level' or 'gameover'
     * @param {string} shareText - Text to share
     * @param {string} shareUrl - URL to share
     */
    setupShareButtons(type, shareText, shareUrl) {
        const prefix = type === 'level' ? 'shareLevel' : 'share';
        const xBtn = this.elements[`${prefix}X`];
        const fbBtn = this.elements[`${prefix}Fb`];

        if (xBtn) {
            xBtn.onclick = () => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                window.open(url, '_blank');
            };
        }

        if (fbBtn) {
            fbBtn.onclick = () => {
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
                window.open(url, '_blank');
            };
        }
    }

    /**
     * Generate share text
     * @param {string} type - 'victory', 'defeat', or 'level'
     * @param {Object} data - Data to replace in template
     * @returns {string}
     */
    generateShareText(type, data) {
        // Convert 'level' to 'level_complete' for template
        const templateKey = type === 'level' ? 'LEVEL_COMPLETE' : type.toUpperCase();
        let template = UI_CONFIG.SHARE_TEXT[templateKey];
        
        // Verify template exists
        if (!template) {
            console.error(`[UIManager] Template not found: ${templateKey}`);
            return 'Overthrow the Galactic - Play now!';
        }
        
        // Replace placeholders
        Object.keys(data).forEach(key => {
            template = template.replace(`{${key}}`, data[key]);
        });

        return template;
    }

    /**
     * Register callback for button
     * @param {string} buttonName - Button name
     * @param {Function} callback
     */
    onButtonClick(buttonName, callback) {
        const button = this.elements[buttonName];
        if (button) {
            button.addEventListener('click', callback);
        }
    }

    /**
     * Update all UI
     * @param {Object} gameState - Current game state
     */
    updateAll(gameState) {
        this.updateLives(gameState.lives);
        this.updateLevel(gameState.level);
        this.updateHealth(gameState.statueHealth, gameState.statueMaxHealth);
    }
}
