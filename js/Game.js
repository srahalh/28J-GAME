/**
 * Game.js
 * Main game class - Initializes and coordinates all systems.
 * Pattern: Facade - Simplifies interaction with complex system.
 */

import GameManager from './core/GameManager.js';
import AssetManager from './managers/AssetManager.js';
import UIManager from './managers/UIManager.js';
import InputManager from './managers/InputManager.js';
import CollisionManager from './managers/CollisionManager.js';
import ScoreManager from './managers/ScoreManager.js';
import EntityFactory from './factories/EntityFactory.js';
import MenuState from './states/MenuState.js';
import PlayingState from './states/PlayingState.js';

export default class Game {
    constructor(canvas) {
        // GameManager Singleton
        this.gameManager = GameManager.getInstance();
        this.gameManager.initialize(canvas);

        // Initialize managers
        this.assetManager = new AssetManager();
        this.uiManager = new UIManager();
        this.inputManager = new InputManager();
        this.collisionManager = new CollisionManager();
        this.scoreManager = new ScoreManager(this.gameManager);
        this.entityFactory = new EntityFactory(this.gameManager);

        // Inject dependencies into GameManager
        this.gameManager.injectDependencies({
            assetManager: this.assetManager,
            uiManager: this.uiManager,
            inputManager: this.inputManager,
            collisionManager: this.collisionManager,
            scoreManager: this.scoreManager,
            entityFactory: this.entityFactory
        });

        this.isInitialized = false;

        console.log('[Game] Game instantiated');
    }

    /**
     * Initialize the game (load assets)
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('[Game] Already initialized');
            return;
        }

        console.log('[Game] Initializing...');

        try {
            // Load all assets
            await this.assetManager.loadAll();
            
            this.isInitialized = true;
            console.log('[Game] Initialization complete');

            // Change to menu state
            this.gameManager.changeState(new MenuState(this.gameManager));
        } catch (error) {
            console.error('[Game] Error in initialization:', error);
            throw error;
        }
    }

    /**
     * Start the game
     */
    start() {
        if (!this.isInitialized) {
            console.error('[Game] Cannot start without initialization');
            return;
        }

        console.log('[Game] Starting game...');
        
        // Reset GameManager
        this.gameManager.start();
        
        // Change to playing state
        this.gameManager.changeState(new PlayingState(this.gameManager));
        
        // Start loop
        this.gameManager.loop(0);
    }

    /**
     * Restart the game
     */
    restart() {
        console.log('[Game] Restarting game...');
        this.gameManager.reset();
        this.start();
    }

    /**
     * Pause the game
     */
    pause() {
        this.gameManager.pause();
    }

    /**
     * Resume the game
     */
    resume() {
        this.gameManager.resume();
    }

    /**
     * Go to next level
     */
    nextLevel() {
        if (this.gameManager.currentState && 
            this.gameManager.currentState.nextLevel) {
            this.gameManager.currentState.nextLevel();
        }
    }

    /**
     * Get the GameManager
     * @returns {GameManager}
     */
    getGameManager() {
        return this.gameManager;
    }
}
