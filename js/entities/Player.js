/**
 * Player.js
 * Player entity - Handles movement and attack.
 */

import Entity from './Entity.js';
import eventBus, { GAME_EVENTS } from '../core/EventBus.js';
import { PLAYER_CONFIG } from '../config/GameConfig.js';

export default class Player extends Entity {
    constructor(gameManager, statue) {
        // Calculate initial position on top of statue
        const x = statue.x + statue.width / 2 - PLAYER_CONFIG.WIDTH / 2;
        const y = statue.y + PLAYER_CONFIG.STATUE_Y_OFFSET;
        
        super(gameManager, x, y, PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);

        this.statue = statue;
        this.speed = PLAYER_CONFIG.SPEED;
        this.hammerCooldown = 0;
        this.isAttacking = false;
        this.facing = 'left';
    }

    /**
     * Update player
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.handleMovement(deltaTime);
        this.handleAttack(deltaTime);
        this.constrainToStatue();
    }

    /**
     * Handle player movement
     * @param {number} deltaTime
     */
    handleMovement(deltaTime) {
        const input = this.gameManager.inputManager;

        if (input.isActionPressed('MOVE_LEFT')) {
            this.x -= this.speed * deltaTime;
            this.facing = 'left';
        }
        if (input.isActionPressed('MOVE_RIGHT')) {
            this.x += this.speed * deltaTime;
            this.facing = 'right';
        }
        if (input.isActionPressed('MOVE_UP')) {
            this.y -= this.speed * deltaTime;
        }
        if (input.isActionPressed('MOVE_DOWN')) {
            this.y += this.speed * deltaTime;
        }
    }

    /**
     * Handle player attack
     * @param {number} deltaTime
     */
    handleAttack(deltaTime) {
        // Update cooldown
        if (this.hammerCooldown > 0) {
            this.hammerCooldown -= deltaTime;
        }

        // Check attack input
        const input = this.gameManager.inputManager;
        if (input.isActionPressed('ATTACK') && this.hammerCooldown <= 0) {
            this.attack();
            this.hammerCooldown = PLAYER_CONFIG.HAMMER_COOLDOWN;
            this.isAttacking = true;

            // Reset attack animation
            setTimeout(() => {
                this.isAttacking = false;
            }, PLAYER_CONFIG.ATTACK_DURATION);
        }
    }

    /**
     * Perform attack
     */
    attack() {
        this.statue.takeDamage(PLAYER_CONFIG.DAMAGE);
        eventBus.emit(GAME_EVENTS.PLAYER_ATTACK, { damage: PLAYER_CONFIG.DAMAGE });
    }

    /**
     * Constrain movement to statue bounds
     */
    constrainToStatue() {
        const margin = PLAYER_CONFIG.MARGIN_STATUE;
        const bounds = {
            x: this.statue.x + margin,
            y: this.statue.y,
            width: this.statue.width - (margin * 2),
            height: this.statue.height
        };

        this.gameManager.collisionManager.constrainToBounds(this, bounds);
    }

    /**
     * Render player
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const assetKey = this.isAttacking ? 'PLAYER_ATTACK' : 'PLAYER_IDLE';
        const sprite = this.gameManager.assetManager.getAsset(assetKey);
        
        this.drawSprite(ctx, sprite, this.facing === 'right');
    }

    /**
     * Draw fallback if sprite not available
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFallback(ctx) {
        super.drawFallback(ctx, '#333');
    }
}
