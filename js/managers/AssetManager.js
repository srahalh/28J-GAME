/**
 * AssetManager.js
 * Centralized resource manager (images, audio, etc).
 * Pattern: Resource Manager
 */

import { ASSET_PATHS } from '../config/GameConfig.js';

export default class AssetManager {
    constructor() {
        this.assets = new Map();
        this.loadingPromises = [];
        this.isLoaded = false;
    }

    /**
     * Preload all game assets
     * @returns {Promise<void>}
     */
    async loadAll() {
        console.log('[AssetManager] Loading assets...');

        for (const [key, path] of Object.entries(ASSET_PATHS)) {
            const promise = this.loadImage(key, path);
            this.loadingPromises.push(promise);
        }

        try {
            await Promise.all(this.loadingPromises);
            this.isLoaded = true;
            console.log('[AssetManager] All assets loaded');
        } catch (error) {
            console.error('[AssetManager] Error loading assets:', error);
            throw error;
        }
    }

    /**
     * Load an image
     * @param {string} key - Unique identifier
     * @param {string} path - Asset path
     * @returns {Promise<Image>}
     */
    loadImage(key, path) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            
            image.onload = () => {
                this.assets.set(key, image);
                console.log(`[AssetManager] Loaded: ${key}`);
                resolve(image);
            };

            image.onerror = () => {
                console.error(`[AssetManager] Error loading: ${key} from ${path}`);
                reject(new Error(`Failed to load image: ${path}`));
            };

            image.src = path;
        });
    }

    /**
     * Get an asset by its key
     * @param {string} key - Asset identifier
     * @returns {Image|null}
     */
    getAsset(key) {
        return this.assets.get(key) || null;
    }

    /**
     * Check if an asset exists and is loaded
     * @param {string} key - Asset identifier
     * @returns {boolean}
     */
    hasAsset(key) {
        const asset = this.assets.get(key);
        return asset && asset.complete;
    }

    /**
     * Check if all assets are loaded
     * @returns {boolean}
     */
    areAllLoaded() {
        return this.isLoaded;
    }

    /**
     * Clear all assets
     */
    clear() {
        this.assets.clear();
        this.loadingPromises = [];
        this.isLoaded = false;
    }
}
