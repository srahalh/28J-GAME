export default class Player {
    constructor(game) {
        this.game = game;

        // Load Sprites
        this.imageIdle = new Image();
        this.imageIdle.src = 'assets/player_idle.png';

        this.imageAttack = new Image();
        this.imageAttack.src = 'assets/player_attack.png';

        // Increased size
        this.width = 80;
        this.height = 100;

        // Start position: On top of statue (calculate after statue exists)
        if (this.game.statue) {
            this.x = this.game.statue.x + this.game.statue.width / 2 - this.width / 2;
            this.y = this.game.statue.y + 50;
        } else {
            // Fallback position
            this.x = this.game.width / 2 - this.width / 2;
            this.y = this.game.height / 2;
        }

        this.speed = 0.35;

        this.hammerCooldown = 0;
        this.isAttacking = false;

        // Hitbox
        this.hitbox = { x: 0, y: 0, w: 0, h: 0 };

        // Direction state
        this.facing = 'left';
    }

    update(deltaTime) {
        // Movement Input
        if (this.game.input.keys.includes('ArrowLeft') || this.game.input.keys.includes('a')) {
            this.x -= this.speed * deltaTime;
            this.facing = 'left';
        }
        if (this.game.input.keys.includes('ArrowRight') || this.game.input.keys.includes('d')) {
            this.x += this.speed * deltaTime;
            this.facing = 'right';
        }
        if (this.game.input.keys.includes('ArrowUp') || this.game.input.keys.includes('w')) {
            this.y -= this.speed * deltaTime;
        }
        if (this.game.input.keys.includes('ArrowDown') || this.game.input.keys.includes('s')) {
            this.y += this.speed * deltaTime;
        }

        // Constrain to Statue Bounds (with adjusted margins)
        const statue = this.game.statue;
        if (this.x < statue.x + 25) this.x = statue.x + 25;
        if (this.x > statue.x + statue.width - this.width - 25) this.x = statue.x + statue.width - this.width - 25;
        if (this.y < statue.y) this.y = statue.y;
        if (this.y > statue.y + statue.height - this.height) this.y = statue.y + statue.height - this.height;

        // Attack Input
        if (this.hammerCooldown > 0) this.hammerCooldown -= deltaTime;

        if (this.game.input.keys.includes(' ') && this.hammerCooldown <= 0) {
            this.attack();
            this.hammerCooldown = 500; // ms
            this.isAttacking = true;
            // Little timeout to reset animation state visually if we had more frames
            setTimeout(() => { this.isAttacking = false; }, 200);
        }

        // Hitbox update
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        this.hitbox.w = this.width;
        this.hitbox.h = this.height;
    }

    draw(ctx) {
        let sprite = this.imageIdle;
        if (this.isAttacking) {
            sprite = this.imageAttack;
        }

        if (sprite.complete) {
            ctx.save();
            if (this.facing === 'right') {
                ctx.scale(-1, 1);
                ctx.drawImage(sprite, -this.x - this.width, this.y, this.width, this.height);
            } else {
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    attack() {
        this.game.statue.takeDamage(5);
    }
}
