/**
 * Statue.js
 * Statue entity - Main game objective.
 */

import Entity from './Entity.js';
import eventBus, { GAME_EVENTS } from '../core/EventBus.js';
import { STATUE_CONFIG, CANVAS_CONFIG } from '../config/GameConfig.js';

export default class Statue extends Entity {
    constructor(gameManager, health) {
        // Center on screen
        const x = (CANVAS_CONFIG.WIDTH - STATUE_CONFIG.WIDTH) / 2;
        const y = CANVAS_CONFIG.HEIGHT - STATUE_CONFIG.BOTTOM_OFFSET - STATUE_CONFIG.HEIGHT;
        
        super(gameManager, x, y, STATUE_CONFIG.WIDTH, STATUE_CONFIG.HEIGHT);

        this.maxHealth = health;
        this.currentHealth = health;
    }

    /**
     * Update statue
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Statue is static, no update needed
    }

    /**
     * Take damage
     * @param {number} amount - Damage amount
     */
    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }

        // Emit damage event
        eventBus.emit(GAME_EVENTS.STATUE_DAMAGED, {
            current: this.currentHealth,
            max: this.maxHealth
        });

        // Update UI
        eventBus.emit(GAME_EVENTS.HEALTH_UPDATE, {
            current: this.currentHealth,
            max: this.maxHealth
        });

        // Check destruction
        if (this.currentHealth <= 0) {
            eventBus.emit(GAME_EVENTS.STATUE_DESTROYED);
        }
    }

    /**
     * Get health percentage
     * @returns {number} Value between 0 and 1
     */
    getHealthPercentage() {
        return this.currentHealth / this.maxHealth;
    }

    /**
     * Check if damaged
     * @returns {boolean}
     */
    isDamaged() {
        return this.getHealthPercentage() <= STATUE_CONFIG.DAMAGE_THRESHOLD;
    }

    /**
     * Render statue
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const assetKey = this.isDamaged() ? 'STATUE_DAMAGED' : 'STATUE';
        const sprite = this.gameManager.assetManager.getAsset(assetKey);
        
        this.drawSprite(ctx, sprite);
    }

    /**
     * Draw fallback if sprite not available
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFallback(ctx) {
        super.drawFallback(ctx, '#888');
    }

    /**
     * Get bounds to constrain player movement
     * @returns {Object}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
