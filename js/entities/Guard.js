/**
 * Guard.js
 * Enemy guard entity - Patrols and shoots projectiles.
 */

import Entity from './Entity.js';
import eventBus, { GAME_EVENTS } from '../core/EventBus.js';
import { GUARD_CONFIG, CANVAS_CONFIG } from '../config/GameConfig.js';

export default class Guard extends Entity {
    constructor(gameManager) {
        // Fixed Y position near ground
        const x = Math.random() * (CANVAS_CONFIG.WIDTH - GUARD_CONFIG.WIDTH);
        const y = CANVAS_CONFIG.HEIGHT - GUARD_CONFIG.BOTTOM_OFFSET - GUARD_CONFIG.HEIGHT;
        
        super(gameManager, x, y, GUARD_CONFIG.WIDTH, GUARD_CONFIG.HEIGHT);

        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.speed = Math.random() * (GUARD_CONFIG.MAX_SPEED - GUARD_CONFIG.MIN_SPEED) + GUARD_CONFIG.MIN_SPEED;
        this.shootTimer = Math.random() * (GUARD_CONFIG.MAX_SHOOT_INTERVAL - GUARD_CONFIG.MIN_SHOOT_INTERVAL) + GUARD_CONFIG.MIN_SHOOT_INTERVAL;
        this.gunOffset = { ...GUARD_CONFIG.GUN_OFFSET };
    }

    /**
     * Update guard
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.handleMovement(deltaTime);
        this.handleShooting(deltaTime);
    }

    /**
     * Handle patrol movement
     * @param {number} deltaTime
     */
    handleMovement(deltaTime) {
        this.x += this.speed * deltaTime * this.direction;

        // Change direction at edges
        if (this.x < 0) {
            this.x = 0;
            this.direction = 1;
        } else if (this.x > CANVAS_CONFIG.WIDTH - this.width) {
            this.x = CANVAS_CONFIG.WIDTH - this.width;
            this.direction = -1;
        }
    }

    /**
     * Handle projectile shooting
     * @param {number} deltaTime
     */
    handleShooting(deltaTime) {
        this.shootTimer -= deltaTime;
        
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = Math.random() * (GUARD_CONFIG.MAX_SHOOT_INTERVAL - GUARD_CONFIG.MIN_SHOOT_INTERVAL) + GUARD_CONFIG.MIN_SHOOT_INTERVAL;
        }
    }

    /**
     * Shoot projectile
     */
    shoot() {
        // Calculate weapon position
        let sx = this.x + this.gunOffset.x;
        let sy = this.y + this.gunOffset.y;
        
        if (this.direction === -1) {
            sx = this.x + (this.width - this.gunOffset.x);
        }

        // Get player as target
        const player = this.gameManager.getPlayer();
        if (!player) return;

        // Create projectile through factory
        const projectile = this.gameManager.entityFactory.createProjectile(sx, sy, player);

        // Add to current state
        this.gameManager.addProjectile(projectile);
        
        eventBus.emit(GAME_EVENTS.ENEMY_SHOOT, { x: sx, y: sy });
    }

    /**
     * Render guard
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const sprite = this.gameManager.assetManager.getAsset('GUARD');
        this.drawSprite(ctx, sprite, this.direction === -1);
    }

    /**
     * Draw fallback if sprite not available
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFallback(ctx) {
        super.drawFallback(ctx, '#2F4F4F');
    }
}
