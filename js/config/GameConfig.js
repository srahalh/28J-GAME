/**
 * GameConfig.js
 * Centralized game configuration.
 * Contains all constants, level configurations and assets.
 * Pattern: Configuration Object
 */

export const CANVAS_CONFIG = {
    WIDTH: 800,
    HEIGHT: 600
};

export const GAME_STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    LEVEL_TRANSITION: 'LEVEL_TRANSITION'
};

export const PLAYER_CONFIG = {
    WIDTH: 80,
    HEIGHT: 100,
    SPEED: 0.35,
    HAMMER_COOLDOWN: 500,
    DAMAGE: 5,
    ATTACK_DURATION: 200,
    MARGIN_STATUE: 25,
    STATUE_Y_OFFSET: 50
};

export const STATUE_CONFIG = {
    WIDTH: 200,
    HEIGHT: 360,
    BOTTOM_OFFSET: 80,
    DAMAGE_THRESHOLD: 0.4 // Change sprite when health < 40%
};

export const GUARD_CONFIG = {
    WIDTH: 100,
    HEIGHT: 120,
    MIN_SPEED: 0.05,
    MAX_SPEED: 0.15,
    MIN_SHOOT_INTERVAL: 2000,
    MAX_SHOOT_INTERVAL: 5000,
    BOTTOM_OFFSET: 40,
    GUN_OFFSET: { x: 80, y: 40 }
};

export const PROJECTILE_CONFIG = {
    WIDTH: 30,
    HEIGHT: 30,
    RADIUS: 5,
    BASE_SPEED: 0.2,
    SPEED_PER_LEVEL: 0.05
};

export const LEVEL_CONFIG = {
    MAX_LEVELS: 3,
    1: {
        statueHealth: 60,
        guardCount: 2,
        difficulty: 'easy'
    },
    2: {
        statueHealth: 100,
        guardCount: 4,
        difficulty: 'medium'
    },
    3: {
        statueHealth: 150,
        guardCount: 6,
        difficulty: 'hard'
    }
};

export const SCORE_CONFIG = {
    POINTS_PER_LEVEL: 1000,
    TIME_PENALTY_PER_SECOND: 10,
    VICTORY_BONUS: 5000
};

export const ASSET_PATHS = {
    PLAYER_IDLE: 'assets/player_idle.png',
    PLAYER_ATTACK: 'assets/player_attack.png',
    GUARD: 'assets/guard.png',
    STATUE: 'assets/statue.png',
    STATUE_DAMAGED: 'assets/statue_condition.png',
    PROJECTILE: 'assets/projectile.png',
    BACKGROUND: 'assets/wallpaper.png'
};

export const UI_CONFIG = {
    HEARTS: ['💛', '💙', '❤️'],
    SHARE_TEXT: {
        VICTORY: 'VICTORIA! He derrocado al régimen con {score} puntos en Derriba al Galáctico. ¡Viva Venezuela Libre! #DerribaAlGalactico',
        DEFEAT: 'El régimen me ha capturado en el nivel {level} con {score} puntos. ¡La lucha continúa! #DerribaAlGalactico',
        LEVEL_COMPLETE: '¡Nivel {level} superado en Derriba al Galáctico! Puntuación: {score}. #DerribaAlGaláctico #VenezuelaLibre'
    },
    MESSAGES: {
        VICTORY: '¡Victoria! ¡La tiranía ha caído!',
        DEFEAT: 'Como a los +1000 presos políticos que hay en Venezuela'
    }
};

export const INPUT_KEYS = {
    MOVE_LEFT: ['ArrowLeft', 'a'],
    MOVE_RIGHT: ['ArrowRight', 'd'],
    MOVE_UP: ['ArrowUp', 'w'],
    MOVE_DOWN: ['ArrowDown', 's'],
    ATTACK: [' ']
};

export const BACKGROUND_CONFIG = {
    SCALE_X: 1.3,
    SCALE_Y: 1.1,
    FALLBACK_COLOR: '#87CEEB'
};
