# 📚 Documentation Index

## Main Documents

### 1. [README.md](./README.md) 📖
**Your first reading point**
- Summary of improvements
- Before vs after comparison
- Implemented patterns
- Architecture diagram
- Execution flow
- Event system
- Refactoring advantages

### 2. [ARCHITECTURE.md](./ARCHITECTURE.md) 🏗️
**Detailed technical documentation**
- Complete folder structure
- Explanation of each pattern
- SOLID references
- Complete game flow
- Entity hierarchy
- Centralized configuration

### 3. [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) 🔧
**Practical extension guide**
- Code examples for:
  - Adding new entity (Bomb)
  - Adding new state (PausedState)
  - Adding new manager (AudioManager)
  - Power-up system
  - Particle system
- Best practices
- Code conventions
- Performance tips

## Code Structure

### Core (Fundamental Patterns)
```
js/core/
├── EventBus.js       → Observer Pattern
└── GameManager.js    → Singleton Pattern
```

### Configuration
```
js/config/
└── GameConfig.js     → All centralized constants
```

### Entities (With Inheritance)
```
js/entities/
├── Entity.js         → Abstract base class
├── Player.js         → Player
├── Guard.js          → Enemy
├── Statue.js         → Target
└── Projectile.js     → Projectile
```

### States (State Pattern)
```
js/states/
├── GameState.js              → Abstract base class
├── MenuState.js              → Main menu
├── PlayingState.js           → Playing
├── LevelTransitionState.js   → Level transition
└── GameOverState.js          → Game over
```

### Managers (Single Responsibility)
```
js/managers/
├── AssetManager.js       → Resource loading
├── CollisionManager.js   → Collision detection
├── InputManager.js       → Keyboard input
├── ScoreManager.js       → Scoring
└── UIManager.js          → User interface
```

### Factories (Factory Pattern)
```
js/factories/
└── EntityFactory.js      → Entity creation
```

### Main Files
```
js/
├── Game.js               → Main class (Facade)
└── main.js               → Entry point
```

## Recommended Reading Order

### To Understand the Project:
1. **README.md** - Overview
2. **ARCHITECTURE.md** - Technical details
3. **Source code** - Review with JSDoc

### To Extend the Project:
1. **DEVELOPMENT_GUIDE.md** - Practical examples
2. **GameConfig.js** - See available configurations
3. **EntityFactory.js** - See how to create entities
4. **GameState.js** - See how to create states

### For Interviews/Portfolio:
1. **README.md** - Show improvements
2. **ARCHITECTURE.md** - Explain patterns
3. **Specific code** - Demonstrate implementation

## Quick Patterns

### Observer Pattern
```javascript
// Emit
eventBus.emit(GAME_EVENTS.PLAYER_DAMAGED, data);

// Listen
eventBus.on(GAME_EVENTS.PLAYER_DAMAGED, callback);
```

### Singleton Pattern
```javascript
const gm = GameManager.getInstance();
```

### Factory Pattern
```javascript
const player = entityFactory.createPlayer(statue);
const guards = entityFactory.createGuards(level);
```

### State Pattern
```javascript
gameManager.changeState(new PlayingState(gameManager));
```

## Simplified Diagram

```
main.js
   ↓
Game.js (Facade)
   ↓
GameManager (Singleton) ← EventBus (Observer)
   ↓
States (State Pattern)
   ↓
Entities ← EntityFactory (Factory)
```

## Contact and Contributions

- Legacy code in: `js/legacy/`
- All files have JSDoc
- No external dependencies (Vanilla JS)

---

**Happy Coding! 🚀**
