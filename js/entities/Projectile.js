/**
 * Projectile.js
 * Projectile entity - Shot by guards towards the player.
 */

import Entity from './Entity.js';
import eventBus, { GAME_EVENTS } from '../core/EventBus.js';
import { PROJECTILE_CONFIG, CANVAS_CONFIG } from '../config/GameConfig.js';

export default class Projectile extends Entity {
    constructor(gameManager, x, y, target) {
        super(gameManager, x, y, PROJECTILE_CONFIG.WIDTH, PROJECTILE_CONFIG.HEIGHT);

        this.radius = PROJECTILE_CONFIG.RADIUS;
        
        // Calculate speed based on level
        const level = this.gameManager.getCurrentLevel();
        this.speed = PROJECTILE_CONFIG.BASE_SPEED + (level * PROJECTILE_CONFIG.SPEED_PER_LEVEL);

        // Calculate direction towards target
        this.calculateTrajectory(target);
    }

    /**
     * Calculate trajectory towards target
     * @param {Entity} target
     */
    calculateTrajectory(target) {
        const tx = target.x + target.width / 2;
        const ty = target.y + target.height / 2;

        const angle = Math.atan2(ty - this.y, tx - this.x);
        
        this.velocity = {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed
        };
        
        this.angle = angle;
    }

    /**
     * Update projectile
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Move projectile
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        // Check collision with player
        this.checkPlayerCollision();

        // Check if out of bounds
        this.checkOutOfBounds();
    }

    /**
     * Check collision with player
     */
    checkPlayerCollision() {
        const player = this.gameManager.getPlayer();
        if (!player) return;

        if (this.gameManager.collisionManager.checkProjectilePlayer(this, player)) {
            this.onPlayerHit();
        }
    }

    /**
     * Handle collision with player
     */
    onPlayerHit() {
        this.markedForDeletion = true;
        this.gameManager.loseLife();
        
        eventBus.emit(GAME_EVENTS.PLAYER_DAMAGED, {
            lives: this.gameManager.getLives()
        });
    }

    /**
     * Check if out of bounds
     */
    checkOutOfBounds() {
        if (this.gameManager.collisionManager.isOutOfBounds(
            this, 
            CANVAS_CONFIG.WIDTH, 
            CANVAS_CONFIG.HEIGHT
        )) {
            this.markedForDeletion = true;
        }
    }

    /**
     * Render projectile
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const sprite = this.gameManager.assetManager.getAsset('PROJECTILE');

        if (sprite && sprite.complete) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Rotate according to direction + 90 degrees (image points upward)
            const rotationAngle = this.angle + Math.PI / 2;
            ctx.rotate(rotationAngle);
            
            ctx.drawImage(
                sprite,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();
        } else {
            this.drawFallback(ctx);
        }
    }

    /**
     * Draw fallback if sprite not available
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFallback(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }
}
