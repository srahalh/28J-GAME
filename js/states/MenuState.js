/**
 * MenuState.js
 * Main menu state.
 */

import GameState from './GameState.js';

export default class MenuState extends GameState {
    constructor(gameManager) {
        super(gameManager);
    }

    /**
     * Enter state
     */
    enter() {
        console.log('[MenuState] Entering...');
        this.gameManager.uiManager.showStartScreen();
    }

    /**
     * Update state
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // No update logic in menu
    }

    /**
     * Render state
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Menu is handled by HTML/CSS
    }

    /**
     * Exit state
     */
    exit() {
        console.log('[MenuState] Exiting...');
        this.gameManager.uiManager.hideAll();
    }
}
