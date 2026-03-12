/**
 * GameOverState.js
 * Game over state (victory or defeat).
 */

import GameState from './GameState.js';

export default class GameOverState extends GameState {
    constructor(gameManager, isVictory = false) {
        super(gameManager);
        this.isVictory = isVictory;
    }

    /**
     * Enter state
     */
    enter() {
        console.log('[GameOverState] Entering...', this.isVictory ? 'Victory' : 'Defeat');
        
        // Calculate final score
        let score = this.gameManager.scoreManager.calculateScore();
        if (this.isVictory) {
            score = this.gameManager.scoreManager.addVictoryBonus();
        }
        
        // Show game over screen
        this.gameManager.uiManager.showGameOverScreen(this.isVictory, score);
        
        // Setup share buttons
        const shareType = this.isVictory ? 'victory' : 'defeat';
        const shareText = this.gameManager.uiManager.generateShareText(shareType, {
            level: this.gameManager.getCurrentLevel(),
            score
        });
        this.gameManager.uiManager.setupShareButtons('gameover', shareText, window.location.href);
    }

    /**
     * Update state
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // No update logic
    }

    /**
     * Render state
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Game over is handled by HTML/CSS
    }

    /**
     * Exit state
     */
    exit() {
        console.log('[GameOverState] Exiting...');
        this.gameManager.uiManager.hideAll();
    }
}
