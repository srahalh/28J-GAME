/**
 * GameManager.js
 * Singleton Pattern - Main game controller.
 * Centralizes global state and coordinates all managers.
 */

import eventBus, { GAME_EVENTS } from './EventBus.js';
import { GAME_STATES, CANVAS_CONFIG } from '../config/GameConfig.js';

class GameManager {
    constructor() {
        if (GameManager.instance) {
            return GameManager.instance;
        }

        this.canvas = null;
        this.ctx = null;
        this.currentState = null;
        this.currentLevel = 1;
        this.lives = 3;
        this.startTime = 0;
        this.lastTime = 0;
        this.animationId = null;
        this.isPaused = false;

        // Managers will be injected
        this.assetManager = null;
        this.uiManager = null;
        this.inputManager = null;
        this.collisionManager = null;
        this.scoreManager = null;
        this.entityFactory = null;

        GameManager.instance = this;
    }

    /**
     * Get the unique GameManager instance
     * @returns {GameManager}
     */
    static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    /**
     * Initialize the game with canvas
     * @param {HTMLCanvasElement} canvas
     */
    initialize(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CANVAS_CONFIG.WIDTH;
        this.canvas.height = CANVAS_CONFIG.HEIGHT;

        console.log('[GameManager] Initialized');
    }

    /**
     * Inject dependencies (managers)
     * @param {Object} managers - Object with all managers
     */
    injectDependencies(managers) {
        this.assetManager = managers.assetManager;
        this.uiManager = managers.uiManager;
        this.inputManager = managers.inputManager;
        this.collisionManager = managers.collisionManager;
        this.scoreManager = managers.scoreManager;
        this.entityFactory = managers.entityFactory;

        console.log('[GameManager] Dependencies injected');
    }

    /**
     * Change game state
     * @param {GameState} newState
     */
    changeState(newState) {
        if (this.currentState) {
            this.currentState.exit();
        }

        this.currentState = newState;
        this.currentState.enter();

        console.log(`[GameManager] State changed to: ${newState.constructor.name}`);
    }

    /**
     * Start the game
     */
    start() {
        this.currentLevel = 1;
        this.lives = 3;
        this.startTime = Date.now();
        
        eventBus.emit(GAME_EVENTS.GAME_START, { level: this.currentLevel });
    }

    /**
     * Main game loop
     * @param {number} timestamp
     */
    loop(timestamp) {
        if (this.isPaused) {
            this.animationId = requestAnimationFrame(this.loop.bind(this));
            return;
        }

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update and draw current state
        if (this.currentState) {
            this.currentState.update(deltaTime);
            this.currentState.draw(this.ctx);
        }

        this.animationId = requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * Stop the loop
     */
    stopLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Pause the game
     */
    pause() {
        this.isPaused = true;
        eventBus.emit(GAME_EVENTS.GAME_PAUSE);
    }

    /**
     * Resume the game
     */
    resume() {
        this.isPaused = false;
        eventBus.emit(GAME_EVENTS.GAME_RESUME);
    }

    /**
     * Get canvas
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Get 2D context
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.ctx;
    }

    /**
     * Get current level
     * @returns {number}
     */
    getCurrentLevel() {
        return this.currentLevel;
    }

    /**
     * Set level
     * @param {number} level
     */
    setLevel(level) {
        this.currentLevel = level;
    }

    /**
     * Get lives
     * @returns {number}
     */
    getLives() {
        return this.lives;
    }

    /**
     * Set lives
     * @param {number} lives
     */
    setLives(lives) {
        this.lives = Math.max(0, lives);
        eventBus.emit(GAME_EVENTS.LIVES_UPDATE, { lives: this.lives });
    }

    /**
     * Lose one life
     */
    loseLife() {
        this.setLives(this.lives - 1);
    }

    /**
     * Get the current player entity (if available in current state)
     * @returns {Player|null}
     */
    getPlayer() {
        return this.currentState?.getPlayer?.() ?? null;
    }

    /**
     * Add a projectile to the current state (if applicable)
     * @param {Projectile} projectile
     */
    addProjectile(projectile) {
        this.currentState?.addProjectile?.(projectile);
    }

    /**
     * Get start time
     * @returns {number}
     */
    getStartTime() {
        return this.startTime;
    }

    /**
     * Reset the game
     */
    reset() {
        this.stopLoop();
        this.currentLevel = 1;
        this.lives = 3;
        this.isPaused = false;
        this.lastTime = 0;
    }
}

export default GameManager;
