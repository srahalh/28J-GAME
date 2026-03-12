/**
 * EntityFactory.js
 * Factory Pattern - Centralizes game entity creation.
 * Facilitates consistent creation and configuration of entities.
 */

import Player from '../entities/Player.js';
import Guard from '../entities/Guard.js';
import Statue from '../entities/Statue.js';
import Projectile from '../entities/Projectile.js';
import { LEVEL_CONFIG } from '../config/GameConfig.js';

export default class EntityFactory {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    /**
     * Create the player
     * @param {Statue} statue - Statue for positioning
     * @returns {Player}
     */
    createPlayer(statue) {
        return new Player(this.gameManager, statue);
    }

    /**
     * Create the statue for a specific level
     * @param {number} level - Level number
     * @returns {Statue}
     */
    createStatue(level) {
        const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
        return new Statue(this.gameManager, config.statueHealth);
    }

    /**
     * Create guards for a specific level
     * @param {number} level - Level number
     * @returns {Array<Guard>}
     */
    createGuards(level) {
        const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
        const guards = [];

        for (let i = 0; i < config.guardCount; i++) {
            guards.push(new Guard(this.gameManager));
        }

        return guards;
    }

    /**
     * Create a projectile
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     * @param {Object} target - Projectile target
     * @returns {Projectile}
     */
    createProjectile(x, y, target) {
        return new Projectile(this.gameManager, x, y, target);
    }

    /**
     * Create all entities for a level
     * @param {number} level - Level number
     * @returns {Object} Object with all created entities
     */
    createLevelEntities(level) {
        const statue = this.createStatue(level);
        const player = this.createPlayer(statue);
        const guards = this.createGuards(level);

        return {
            statue,
            player,
            guards,
            projectiles: []
        };
    }
}
