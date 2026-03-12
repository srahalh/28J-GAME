# 🚀 Quick Start Guide

## Running the Game

### Option 1: Live Server (VS Code)
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. The game will open in your browser

### Option 2: Python
```bash
python3 -m http.server 8080
```
Then open: `http://localhost:8080`

### Option 3: Node.js
```bash
npx http-server
```
Then open: `http://localhost:8080`

### Option 4: PHP
```bash
php -S localhost:8080
```
Then open: `http://localhost:8080`

## Game Controls

### Desktop
- **Movement**: ⬅️ ⬆️ ⬇️ ➡️ or `WASD`
- **Attack**: `Spacebar`

### Mobile (touch devices)
- **Movement**: On-screen D-pad
- **Attack**: On-screen attack button

## Understanding the Code

### Read in This Order:
1. **[README.md](./README.md)** ← Complete overview (10 min)
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** ← Technical details (15 min)
3. **Source code** ← With complete JSDoc

### To Modify the Game:
1. **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** ← Practical examples

## Quick Structure

```
js/
├── Game.js              ← Starting point
├── main.js              ← Entry point
├── config/              ← All constants
├── core/                ← Fundamental patterns
├── entities/            ← Player, Guard, Statue, etc
├── managers/            ← Asset, UI, Input, Score, Collision
├── states/              ← Menu, Playing, GameOver, etc
└── factories/           ← Entity creation
```

## Quick Patterns

### Create Entity
```javascript
// entities/MyEntity.js
import Entity from './Entity.js';

export default class MyEntity extends Entity {
    constructor(gameManager, x, y) {
        super(gameManager, x, y, width, height);
    }
    
    update(deltaTime) { /* logic */ }
    draw(ctx) { /* rendering */ }
}
```

### Emit Event
```javascript
import eventBus, { GAME_EVENTS } from './core/EventBus.js';

eventBus.emit(GAME_EVENTS.MY_EVENT, { data });
```

### Listen to Event
```javascript
eventBus.on(GAME_EVENTS.MY_EVENT, (data) => {
    console.log('Event received:', data);
});
```

### Add Configuration
```javascript
// config/GameConfig.js
export const MY_CONFIG = {
    VALUE1: 100,
    VALUE2: 'text'
};
```

## Important Files

| File | Purpose |
|------|---------|
| `index.html` | Main page |
| `js/main.js` | Initialization |
| `js/Game.js` | Main class |
| `js/config/GameConfig.js` | All configuration |
| `js/core/GameManager.js` | Singleton controller |
| `js/core/EventBus.js` | Event system |

## Debugging

### Console Logs
All components have useful logs:
```
[GameManager] Initialized
[AssetManager] Loading assets...
[PlayingState] Entering...
[PlayingState] Level 1 loaded
```

### Common Errors

#### Assets not loading
- Verify the server is running
- Check paths in `config/GameConfig.js`
- Open DevTools to see errors

#### Blank canvas
- Verify `index.html` has `<canvas id="gameCanvas">`
- Verify assets are loaded
- Check console for errors

#### Input not working
- Verify canvas has focus
- Check `managers/InputManager.js`
- Verify mapping in `config/GameConfig.js`

## Next Steps

1. **Play the game** to understand mechanics
2. **Read README.md** for quick context
3. **Review the code** with JSDoc as guide
4. **Read detailed guides** as needed
5. **Modify and extend** using DEVELOPMENT_GUIDE.md

## Resources

- **Assets**: `assets/` (game images)
- **Docs**: `*.md` (5 complete guides)

## Support

If something doesn't work:
1. Check browser console (F12)
2. Verify server is running
3. Read logs in console
4. Check README.md to understand architecture

---

**Enjoy exploring the code!** 🎮

## Documentation Index

📄 [README.md](./README.md) - Complete overview
📄 [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
📄 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Development guide
📄 [INDEX.md](./INDEX.md) - Navigable index
