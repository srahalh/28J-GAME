/**
 * Entity.js
 * Abstract base class for all game entities.
 * Implements common properties and methods.
 */

export default class Entity {
    constructor(gameManager, x, y, width, height) {
        this.gameManager = gameManager;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.markedForDeletion = false;
    }

    /**
     * Update entity - must be implemented by subclasses
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Override in subclasses
    }

    /**
     * Render entity - must be implemented by subclasses
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Override in subclasses
    }

    /**
     * Get entity hitbox
     * @returns {Object} {x, y, width, height}
     */
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Mark entity for deletion
     */
    destroy() {
        this.markedForDeletion = true;
    }

    /**
     * Check if entity should be deleted
     * @returns {boolean}
     */
    shouldDelete() {
        return this.markedForDeletion;
    }

    /**
     * Draw sprite with horizontal flip option
     * @param {CanvasRenderingContext2D} ctx
     * @param {Image} sprite
     * @param {boolean} flipX
     */
    drawSprite(ctx, sprite, flipX = false) {
        if (!sprite || !sprite.complete) {
            this.drawFallback(ctx);
            return;
        }

        ctx.save();
        
        if (flipX) {
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        }
        
        ctx.restore();
    }

    /**
     * Draw fallback rectangle when sprite is not available
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} color
     */
    drawFallback(ctx, color = '#888') {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
