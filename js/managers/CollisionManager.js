/**
 * CollisionManager.js
 * Collision manager between entities.
 * Centralizes collision detection logic.
 */

export default class CollisionManager {
    constructor() {
        this.collisionChecks = [];
    }

    /**
     * Check collision between two rectangles (AABB)
     * @param {Object} rect1 - {x, y, width, height}
     * @param {Object} rect2 - {x, y, width, height}
     * @returns {boolean}
     */
    checkAABB(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    /**
     * Check collision between point and rectangle
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @param {Object} rect - {x, y, width, height}
     * @returns {boolean}
     */
    checkPointRect(px, py, rect) {
        return px > rect.x &&
               px < rect.x + rect.width &&
               py > rect.y &&
               py < rect.y + rect.height;
    }

    /**
     * Check collision between circle and rectangle
     * @param {Object} circle - {x, y, radius}
     * @param {Object} rect - {x, y, width, height}
     * @returns {boolean}
     */
    checkCircleRect(circle, rect) {
        // Find the closest point on the rectangle to the circle's center
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

        // Calculate distance
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        return distanceSquared < (circle.radius * circle.radius);
    }

    /**
     * Check collision between projectile and player
     * @param {Projectile} projectile
     * @param {Player} player
     * @returns {boolean}
     */
    checkProjectilePlayer(projectile, player) {
        return this.checkPointRect(
            projectile.x,
            projectile.y,
            {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height
            }
        );
    }

    /**
     * Check if a point is within bounds
     * @param {number} x
     * @param {number} y
     * @param {Object} bounds - {x, y, width, height}
     * @returns {boolean}
     */
    isWithinBounds(x, y, bounds) {
        return x >= bounds.x &&
               x <= bounds.x + bounds.width &&
               y >= bounds.y &&
               y <= bounds.y + bounds.height;
    }

    /**
     * Check if an entity is outside the screen
     * @param {Object} entity - {x, y, width, height}
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     * @returns {boolean}
     */
    isOutOfBounds(entity, canvasWidth, canvasHeight) {
        return entity.x + entity.width < 0 ||
               entity.x > canvasWidth ||
               entity.y + entity.height < 0 ||
               entity.y > canvasHeight;
    }

    /**
     * Constrain position within bounds
     * @param {Object} entity - {x, y, width, height}
     * @param {Object} bounds - {x, y, width, height}
     */
    constrainToBounds(entity, bounds) {
        if (entity.x < bounds.x) {
            entity.x = bounds.x;
        }
        if (entity.x + entity.width > bounds.x + bounds.width) {
            entity.x = bounds.x + bounds.width - entity.width;
        }
        if (entity.y < bounds.y) {
            entity.y = bounds.y;
        }
        if (entity.y + entity.height > bounds.y + bounds.height) {
            entity.y = bounds.y + bounds.height - entity.height;
        }
    }
}
