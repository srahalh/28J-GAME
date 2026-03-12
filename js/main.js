/**
 * main.js
 * Application entry point.
 * Initializes the game and sets up UI event listeners.
 */

import Game from './Game.js';

/**
 * Initialize application when DOM is ready
 */
addEventListener('DOMContentLoaded', async () => {
    console.log('[Main] DOM loaded, initializing application...');

    // Get canvas
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('[Main] Canvas not found');
        return;
    }

    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Create game instance
    const game = new Game(canvas);

    // Initialize (load assets)
    try {
        await game.initialize();
        console.log('[Main] Game ready');
    } catch (error) {
        console.error('[Main] Error initializing game:', error);
        alert('Error loading game. Please reload the page.');
        return;
    }

    // Setup UI event listeners
    setupUIEventListeners(game);
});

/**
 * Setup interface event listeners
 * @param {Game} game - Game instance
 */
function setupUIEventListeners(game) {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('[Main] Start button pressed');
            game.start();
        });
    }

    // Restart button
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            console.log('[Main] Restart button pressed');
            game.restart();
        });
    }

    // Next level button
    const nextLevelBtn = document.getElementById('next-level-btn');
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', () => {
            console.log('[Main] Next Level button pressed');
            game.nextLevel();
        });
    }

    console.log('[Main] Event listeners configured');
}

// Handle global errors
window.addEventListener('error', (event) => {
    console.error('[Main] Global error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('[Main] Unhandled promise rejection:', event.reason);
});
