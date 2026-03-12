/**
 * ScoreManager.js
 * Score manager.
 * Calculates and maintains game score.
 */

import { SCORE_CONFIG } from '../config/GameConfig.js';
import eventBus, { GAME_EVENTS } from '../core/EventBus.js';

export default class ScoreManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentScore = 0;
    }

    /**
     * Calculate current score
     * @returns {number}
     */
    calculateScore() {
        const endTime = Date.now();
        const startTime = this.gameManager.getStartTime();
        const durationSeconds = Math.floor((endTime - startTime) / 1000);
        const level = this.gameManager.getCurrentLevel();

        let score = (level * SCORE_CONFIG.POINTS_PER_LEVEL) - 
                    (durationSeconds * SCORE_CONFIG.TIME_PENALTY_PER_SECOND);

        this.currentScore = Math.max(0, score);
        
        eventBus.emit(GAME_EVENTS.SCORE_UPDATE, { score: this.currentScore });
        
        return this.currentScore;
    }

    /**
     * Add victory bonus
     * @returns {number}
     */
    addVictoryBonus() {
        this.currentScore += SCORE_CONFIG.VICTORY_BONUS;
        eventBus.emit(GAME_EVENTS.SCORE_UPDATE, { score: this.currentScore });
        return this.currentScore;
    }

    /**
     * Get current score
     * @returns {number}
     */
    getScore() {
        return this.currentScore;
    }

    /**
     * Reset score
     */
    reset() {
        this.currentScore = 0;
    }
}
