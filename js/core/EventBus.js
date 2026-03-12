/**
 * EventBus.js
 * Observer Pattern - Centralized event system.
 * Enables decoupled communication between game components.
 */

export class EventBus {
    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }
        
        this.listeners = new Map();
        EventBus.instance = this;
    }

    /**
     * Subscribe a callback to an event
     * @param {string} eventName - Event name
     * @param {Function} callback - Function to execute when event occurs
     * @returns {Function} Function to unsubscribe
     */
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        
        this.listeners.get(eventName).push(callback);
        
        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }

    /**
     * Unsubscribe a callback from an event
     * @param {string} eventName - Event name
     * @param {Function} callback - Function to unsubscribe
     */
    off(eventName, callback) {
        if (!this.listeners.has(eventName)) return;
        
        const callbacks = this.listeners.get(eventName);
        const index = callbacks.indexOf(callback);
        
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Emit an event
     * @param {string} eventName - Event name
     * @param {*} data - Data to pass to callbacks
     */
    emit(eventName, data) {
        if (!this.listeners.has(eventName)) return;
        
        const callbacks = this.listeners.get(eventName);
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in listener for ${eventName}:`, error);
            }
        });
    }

    /**
     * Remove all listeners
     */
    clear() {
        this.listeners.clear();
    }
}

// Singleton instance
export default new EventBus();

// Event Names Constants
export const GAME_EVENTS = {
    // Game Flow
    GAME_START: 'game:start',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_OVER: 'game:over',
    LEVEL_COMPLETE: 'level:complete',
    LEVEL_START: 'level:start',
    
    // Player Events
    PLAYER_DAMAGED: 'player:damaged',
    PLAYER_ATTACK: 'player:attack',
    PLAYER_MOVE: 'player:move',
    
    // Enemy Events
    ENEMY_SHOOT: 'enemy:shoot',
    ENEMY_DESTROYED: 'enemy:destroyed',
    
    // Statue Events
    STATUE_DAMAGED: 'statue:damaged',
    STATUE_DESTROYED: 'statue:destroyed',
    
    // UI Events
    UI_UPDATE: 'ui:update',
    SCORE_UPDATE: 'score:update',
    LIVES_UPDATE: 'lives:update',
    HEALTH_UPDATE: 'health:update'
};
