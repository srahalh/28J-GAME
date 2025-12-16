export default class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.width = 30; // Image display width
        this.height = 30; // Image display height
        // Speed increases with level
        // Level 1: 0.25, Level 2: 0.35, Let's aim for 0.4 at level 2-3 approx
        const baseSpeed = 0.2;
        const levelFactor = 0.08;
        this.speed = baseSpeed + (this.game.level * levelFactor);
        this.markedForDeletion = false;

        // Image is now handled via game.assets.projectile

        // Target player position at time of shooting
        const tx = this.game.player.x + this.game.player.width / 2;
        const ty = this.game.player.y + this.game.player.height / 2;

        const angle = Math.atan2(ty - this.y, tx - this.x);
        this.velocity = {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed
        };
    }

    update(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        // Check collision with player
        const p = this.game.player;
        if (this.x > p.x && this.x < p.x + p.width &&
            this.y > p.y && this.y < p.y + p.height) {

            this.markedForDeletion = true;
            this.game.lives--;
            this.game.updateUI();

            // Optional: Player invulnerability or knockback?
        }

        // Out of bounds
        if (this.x < 0 || this.x > this.game.width ||
            this.y < 0 || this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        // Draw projectile image centered on position
        const img = this.game.assets.projectile;
        if (img && img.complete) {
            ctx.save();
            ctx.translate(this.x, this.y);
            // Angle of movement + 90 degrees (PI/2) because image points up
            const angle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
            ctx.rotate(angle);
            ctx.drawImage(
                img,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();
        } else {
            // Fallback while image loads
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.closePath();
        }
    }
}
