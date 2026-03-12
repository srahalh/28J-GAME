/**
 * LevelTransitionState.js
 * Level transition state.
 */

import GameState from './GameState.js';
import PlayingState from './PlayingState.js';

export default class LevelTransitionState extends GameState {
    constructor(gameManager) {
        super(gameManager);
    }

    /**
     * Enter state
     */
    enter() {
        console.log('[LevelTransitionState] Entering...');
        
        const score = this.gameManager.scoreManager.calculateScore();
        const level = this.gameManager.getCurrentLevel();
        
        // Show transition screen
        this.gameManager.uiManager.showLevelScreen(score);
        
        // Setup share buttons
        const shareText = this.gameManager.uiManager.generateShareText('level', {
            level,
            score
        });
        this.gameManager.uiManager.setupShareButtons('level', shareText, window.location.href);
    }

    /**
     * Go to next level
     */
    nextLevel() {
        const newLevel = this.gameManager.getCurrentLevel() + 1;
        this.gameManager.setLevel(newLevel);
        this.gameManager.changeState(new PlayingState(this.gameManager));
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
        // Transition is handled by HTML/CSS
    }

    /**
     * Exit state
     */
    exit() {
        console.log('[LevelTransitionState] Exiting...');
        this.gameManager.uiManager.hideAll();
    }
}
