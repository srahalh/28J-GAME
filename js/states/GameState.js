/**
 * GameState.js
 * State Pattern - Abstract base class for game states.
 * Defines the common interface for all states.
 */

export default class GameState {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    /**
     * Method executed when entering the state
     */
    enter() {
        // Override in subclasses
    }

    /**
     * Method executed when exiting the state
     */
    exit() {
        // Override in subclasses
    }

    /**
     * Update state logic
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Override in subclasses
    }

    /**
     * Render the state
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Override in subclasses
    }

    /**
     * Handle state-specific input
     * @param {string} key
     */
    handleInput(key) {
        // Override in subclasses
    }
}
