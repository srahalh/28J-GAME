import Game from './Game.js';

addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    // Set canvas resolution
    canvas.width = 800;
    canvas.height = 600;

    const game = new Game(canvas);

    // UI Event Listeners
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    startBtn.addEventListener('click', () => {
        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('start-screen').classList.add('hidden');
        game.start();
    });

    restartBtn.addEventListener('click', () => {
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('game-over-screen').classList.add('hidden');
        game.start();
    });

    const nextLevelBtn = document.getElementById('next-level-btn');
    nextLevelBtn.addEventListener('click', () => {
        game.nextLevel();
    });
});
