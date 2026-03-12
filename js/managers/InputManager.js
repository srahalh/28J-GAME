/**
 * InputManager.js
 * Keyboard and touch input manager.
 * Encapsulates input handling logic for desktop and mobile.
 */

import { INPUT_KEYS } from '../config/GameConfig.js';

export default class InputManager {
    constructor() {
        this.keys = [];
        this.isTouchDevice = false;
        this.touchActions = new Map();

        this._boundKeyDown = this.handleKeyDown.bind(this);
        this._boundKeyUp = this.handleKeyUp.bind(this);

        this.setupListeners();
        this.detectTouchDevice();
    }

    /**
     * Detect if device supports touch and show controls
     */
    detectTouchDevice() {
        const hasTouchSupport = ('ontouchstart' in window) ||
                                (navigator.maxTouchPoints > 0);

        if (hasTouchSupport) {
            this.enableTouchControls();
        }

        window.addEventListener('touchstart', () => {
            if (!this.isTouchDevice) {
                this.enableTouchControls();
            }
        }, { once: true });
    }

    /**
     * Show touch controls and bind touch events
     */
    enableTouchControls() {
        this.isTouchDevice = true;
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.classList.add('active');
            this.setupTouchListeners(touchControls);
        }
    }

    /**
     * Setup keyboard event listeners
     */
    setupListeners() {
        window.addEventListener('keydown', this._boundKeyDown);
        window.addEventListener('keyup', this._boundKeyUp);
    }

    /**
     * Setup touch event listeners on the controls container
     * @param {HTMLElement} container
     */
    setupTouchListeners(container) {
        const buttons = container.querySelectorAll('.touch-btn');

        buttons.forEach(btn => {
            const action = btn.dataset.action;
            if (!action || !INPUT_KEYS[action]) return;

            const virtualKey = INPUT_KEYS[action][0];

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                for (const touch of e.changedTouches) {
                    this.touchActions.set(touch.identifier, { action, virtualKey, element: btn });
                }
                btn.classList.add('pressed');
                if (!this.keys.includes(virtualKey)) {
                    this.keys.push(virtualKey);
                }
            }, { passive: false });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                for (const touch of e.changedTouches) {
                    this.touchActions.delete(touch.identifier);
                }
                const stillPressed = [...this.touchActions.values()].some(
                    t => t.virtualKey === virtualKey
                );
                if (!stillPressed) {
                    btn.classList.remove('pressed');
                    const index = this.keys.indexOf(virtualKey);
                    if (index !== -1) {
                        this.keys.splice(index, 1);
                    }
                }
            }, { passive: false });

            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                for (const touch of e.changedTouches) {
                    this.touchActions.delete(touch.identifier);
                }
                const stillPressed = [...this.touchActions.values()].some(
                    t => t.virtualKey === virtualKey
                );
                if (!stillPressed) {
                    btn.classList.remove('pressed');
                    const index = this.keys.indexOf(virtualKey);
                    if (index !== -1) {
                        this.keys.splice(index, 1);
                    }
                }
            }, { passive: false });
        });

        container.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Handle key press
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        if (this.isValidKey(event.key) && !this.keys.includes(event.key)) {
            this.keys.push(event.key);
        }
    }

    /**
     * Handle key release
     * @param {KeyboardEvent} event
     */
    handleKeyUp(event) {
        if (this.isValidKey(event.key)) {
            const index = this.keys.indexOf(event.key);
            if (index !== -1) {
                this.keys.splice(index, 1);
            }
        }
    }

    /**
     * Check if a key is valid
     * @param {string} key
     * @returns {boolean}
     */
    isValidKey(key) {
        return Object.values(INPUT_KEYS).some(keyGroup => keyGroup.includes(key));
    }

    /**
     * Check if an action is pressed
     * @param {string} action - Action name (MOVE_LEFT, MOVE_RIGHT, etc)
     * @returns {boolean}
     */
    isActionPressed(action) {
        const keyGroup = INPUT_KEYS[action];
        return keyGroup && keyGroup.some(key => this.keys.includes(key));
    }

    /**
     * Get all pressed keys
     * @returns {Array<string>}
     */
    getKeys() {
        return [...this.keys];
    }

    /**
     * Clear all keys
     */
    clear() {
        this.keys = [];
    }

    /**
     * Remove listeners (cleanup)
     */
    destroy() {
        window.removeEventListener('keydown', this._boundKeyDown);
        window.removeEventListener('keyup', this._boundKeyUp);
    }
}
