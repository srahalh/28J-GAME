/**
 * PlayingState.js
 * Active gameplay state - Handles gameplay logic.
 */

import GameState from './GameState.js';
import eventBus, { GAME_EVENTS } from '../core/EventBus.js';
import { CANVAS_CONFIG, BACKGROUND_CONFIG, LEVEL_CONFIG } from '../config/GameConfig.js';
import LevelTransitionState from './LevelTransitionState.js';
import GameOverState from './GameOverState.js';

export default class PlayingState extends GameState {
    constructor(gameManager) {
        super(gameManager);
        
        this.entities = {
            statue: null,
            player: null,
            guards: [],
            projectiles: []
        };
    }

    /**
     * Enter state
     */
    enter() {
        console.log('[PlayingState] Entering...');
        
        // Clear previous input
        if (this.gameManager.inputManager) {
            this.gameManager.inputManager.clear();
        }
        
        const level = this.gameManager.getCurrentLevel();
        console.log(`[PlayingState] Loading level ${level}...`);
        
        this.loadLevel(level);
        
        eventBus.emit(GAME_EVENTS.LEVEL_START, { level });
    }

    /**
     * Load level
     * @param {number} level
     */
    loadLevel(level) {
        console.log(`[PlayingState] Starting level ${level} load...`);
        
        const factory = this.gameManager.entityFactory;
        
        // Create all level entities
        this.entities = factory.createLevelEntities(level);
        
        console.log(`[PlayingState] Entities created:`, {
            statue: !!this.entities.statue,
            player: !!this.entities.player,
            guards: this.entities.guards.length,
            projectiles: this.entities.projectiles.length
        });
        
        // Update UI
        this.updateUI();
        
        console.log(`[PlayingState] Level ${level} loaded completely`);
    }

    /**
     * Update state
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Check entities exist before updating
        if (!this.entities.statue || !this.entities.player) {
            console.warn('[PlayingState] Entities not properly initialized');
            return;
        }
        
        // Update entities
        this.entities.statue.update(deltaTime);
        this.entities.player.update(deltaTime);
        
        if (this.entities.guards) {
            this.entities.guards.forEach(guard => guard.update(deltaTime));
        }
        
        // Update projectiles and remove marked for deletion
        if (this.entities.projectiles) {
            this.entities.projectiles = this.entities.projectiles.filter(proj => {
                proj.update(deltaTime);
                return !proj.markedForDeletion;
            });
        }

        // Check win/lose conditions
        this.checkWinCondition();
        this.checkLoseCondition();
    }

    /**
     * Render state
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);

        // Draw background
        this.drawBackground(ctx);

        // Draw entities (with null protection)
        if (this.entities.statue) {
            this.entities.statue.draw(ctx);
        }
        if (this.entities.player) {
            this.entities.player.draw(ctx);
        }
        if (this.entities.guards) {
            this.entities.guards.forEach(guard => guard.draw(ctx));
        }
        if (this.entities.projectiles) {
            this.entities.projectiles.forEach(proj => proj.draw(ctx));
        }
    }

    /**
     * Draw background
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackground(ctx) {
        const background = this.gameManager.assetManager.getAsset('BACKGROUND');
        
        if (background && background.complete) {
            const scaledW = CANVAS_CONFIG.WIDTH * BACKGROUND_CONFIG.SCALE_X;
            const scaledH = CANVAS_CONFIG.HEIGHT * BACKGROUND_CONFIG.SCALE_Y;
            const offsetX = (CANVAS_CONFIG.WIDTH - scaledW) / 2;
            const offsetY = 0;
            
            ctx.drawImage(background, offsetX, offsetY, scaledW, scaledH);
        } else {
            // Fallback
            ctx.fillStyle = BACKGROUND_CONFIG.FALLBACK_COLOR;
            ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
        }
    }

    /**
     * Check win condition
     */
    checkWinCondition() {
        if (this.entities.statue.currentHealth <= 0) {
            const currentLevel = this.gameManager.getCurrentLevel();
            
            if (currentLevel < LEVEL_CONFIG.MAX_LEVELS) {
                // Transition to next level
                this.gameManager.changeState(new LevelTransitionState(this.gameManager));
            } else {
                // Total victory
                this.gameManager.changeState(new GameOverState(this.gameManager, true));
            }
        }
    }

    /**
     * Check lose condition
     */
    checkLoseCondition() {
        if (this.gameManager.getLives() <= 0) {
            this.gameManager.changeState(new GameOverState(this.gameManager, false));
        }
    }

    /**
     * Update UI
     */
    updateUI() {
        const uiManager = this.gameManager.uiManager;
        
        uiManager.updateAll({
            lives: this.gameManager.getLives(),
            level: this.gameManager.getCurrentLevel(),
            statueHealth: this.entities.statue.currentHealth,
            statueMaxHealth: this.entities.statue.maxHealth
        });
    }

    /**
     * Add projectile
     * @param {Projectile} projectile
     */
    addProjectile(projectile) {
        this.entities.projectiles.push(projectile);
    }

    /**
     * Get player
     * @returns {Player}
     */
    getPlayer() {
        return this.entities.player;
    }

    /**
     * Get statue
     * @returns {Statue}
     */
    getStatue() {
        return this.entities.statue;
    }

    /**
     * Exit state
     */
    exit() {
        console.log('[PlayingState] Exiting...');
        
        // Clear entity references
        this.entities = {
            statue: null,
            player: null,
            guards: [],
            projectiles: []
        };
        
        // Clear input
        if (this.gameManager.inputManager) {
            this.gameManager.inputManager.clear();
        }
    }
}
