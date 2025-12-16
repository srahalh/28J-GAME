export default class Statue {
    constructor(game, health) {
        this.game = game;

        // Load Images
        this.image = new Image();
        this.image.src = 'assets/statue.png';

        this.imageCondition = new Image();
        this.imageCondition.src = 'assets/statue_condition.png';

        this.width = 200;
        this.height = 360;

        this.x = (this.game.width - this.width) / 2;
        this.y = this.game.height - 80 - this.height;

        this.maxHealth = health;
        this.currentHealth = health;

        this.bounds = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    update(deltaTime) {
        // Statue logic
    }

    draw(ctx) {
        let sprite = this.image;
        if (this.currentHealth / this.maxHealth <= 0.4) {
            sprite = this.imageCondition;
        }

        if (sprite.complete) {
            ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#888';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) this.currentHealth = 0;
        this.game.updateUI();
    }
}
