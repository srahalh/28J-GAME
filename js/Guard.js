import Projectile from './Projectile.js';

export default class Guard {
    constructor(game) {
        this.game = game;

        // Load Sprite
        this.image = new Image();
        this.image.src = 'assets/guard.png';

        this.width = 100; // Larger
        this.height = 120;
        this.y = this.game.height - 40 - this.height; // Closer to bottom border (40px ground)

        // Random start X anywhere on screen
        this.x = Math.random() * (this.game.width - this.width);
        this.direction = Math.random() < 0.5 ? 1 : -1;

        this.speed = Math.random() * 0.1 + 0.05;
        this.shootTimer = Math.random() * 3000 + 2000;

        // Hitbox offset for bullets spawning from gun
        this.gunOffset = { x: 80, y: 40 };
    }

    update(deltaTime) {
        // Movement
        this.x += this.speed * deltaTime * this.direction;

        // Patrol limits (full screen width)
        if (this.x < 0) {
            this.x = 0;
            this.direction = 1;
        } else if (this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width;
            this.direction = -1;
        }

        // Shooting
        this.shootTimer -= deltaTime;
        if (this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = Math.random() * 3000 + 2000;
        }
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.save();
            if (this.direction === -1) {
                // Flip sprite if facing left
                ctx.scale(-1, 1);
                ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height);
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    shoot() {
        let sx = this.x + this.gunOffset.x;
        let sy = this.y + this.gunOffset.y;
        if (this.direction === -1) {
            sx = this.x + (this.width - this.gunOffset.x);
        }
        this.game.projectiles.push(new Projectile(this.game, sx, sy));
    }
}
