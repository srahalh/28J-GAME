# 🎯 Derriba al Galáctico

## 🎯 Implemented Design Patterns

### 1. **Singleton Pattern** 🔒
```
GameManager.getInstance() → Single global instance
```
**Benefit**: Centralized control of game state

### 2. **Observer Pattern** 📡
```
EventBus → Decoupled communication
```
**Benefit**: Independent components communicating via events

### 3. **State Pattern** 🔄
```
GameState → MenuState → PlayingState → GameOverState
```
**Benefit**: Clear behavior according to game state

### 4. **Factory Pattern** 🏭
```
EntityFactory.create*() → Centralized creation
```
**Benefit**: Consistent entity configuration

### 5. **Facade Pattern** 🎭
```
Game → Simple interface for complex system
```
**Benefit**: Clean API for client code

## 🏗️ Layered Architecture

```
┌─────────────────────────────────────────┐
│           main.js (Entry Point)         │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Game.js (Facade)                │
│  • Initialization                       │
│  • System coordination                  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Core (Fundamental Patterns)        │
│  • GameManager (Singleton)              │
│  • EventBus (Observer)                  │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
┌───▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼────┐
│States │ │Mgrs  │ │Entity│ │Factory│
│       │ │      │ │      │ │       │
│Menu   │ │Asset │ │Player│ │Entity │
│Playing│ │UI    │ │Guard │ │Factory│
│GameOvr│ │Input │ │Statue│ │       │
│Transit│ │Score │ │Proj  │ │       │
└───────┘ └──────┘ └──────┘ └───────┘
```

## 📁 New Structure

```
game/
├── index.html
├── style.css
├── README.md                  ← This file
├── ARCHITECTURE.md            ← Architecture documentation
├── DEVELOPMENT_GUIDE.md       ← Extension guide
├── assets/                    ← Graphic resources
└── js/
    ├── main.js                ← Entry point
    ├── Game.js                ← Main class (Facade)
    │
    ├── config/                ← Centralized configurations
    │   └── GameConfig.js
    │
    ├── core/                  ← Core patterns
    │   ├── EventBus.js        (Observer)
    │   └── GameManager.js     (Singleton)
    │
    ├── entities/              ← Game entities
    │   ├── Entity.js          (Abstract base)
    │   ├── Player.js
    │   ├── Guard.js
    │   ├── Statue.js
    │   └── Projectile.js
    │
    ├── factories/             ← Entity creation
    │   └── EntityFactory.js   (Factory)
    │
    ├── managers/              ← Specialized managers
    │   ├── AssetManager.js
    │   ├── CollisionManager.js
    │   ├── InputManager.js
    │   ├── ScoreManager.js
    │   └── UIManager.js
    │
    ├── states/                ← Game states
    │   ├── GameState.js       (Abstract base)
    │   ├── MenuState.js
    │   ├── PlayingState.js
    │   ├── LevelTransitionState.js
    │   └── GameOverState.js
    │
    └── legacy/                ← Original code (backup)
```

## 🎓 Applied SOLID Principles

### Single Responsibility (SRP) ✅
Each class has **a single reason to change**:
- `AssetManager`: Resource management only
- `InputManager`: User input only
- `CollisionManager`: Collision detection only
- `UIManager`: User interface only

### Open/Closed (OCP) ✅
**Open for extension, closed for modification**:
- Base class `Entity` → Extensible without modification
- Base class `GameState` → New states without changing core
- Event system → Add listeners without modifying emitters

### Liskov Substitution (LSP) ✅
Any `GameState` can substitute another:
```javascript
gameManager.changeState(new PlayingState()); // ✅
gameManager.changeState(new MenuState());    // ✅
```

### Interface Segregation (ISP) ✅
Specialized managers instead of a "super manager":
- Clients don't depend on methods they don't use

### Dependency Inversion (DIP) ✅
Dependencies on abstractions, not concretions:
```javascript
// GameManager depends on injected managers (abstractions)
gameManager.injectDependencies({
    assetManager, uiManager, inputManager...
});
```

## 🔄 Execution Flow

```
1. User opens index.html
          ↓
2. main.js → DOMContentLoaded
          ↓
3. new Game(canvas)
          ↓
4. await game.initialize()
   • Load all assets
   • Configure managers
   • Initial state: MenuState
          ↓
5. User presses "Start"
          ↓
6. game.start()
   • Change to PlayingState
   • Load level 1
   • Start game loop
          ↓
7. Game Loop (60 FPS)
   ┌─────────────────┐
   │ update(deltaT)  │
   │ draw(ctx)       │
   │ RAF → loop      │
   └─────────────────┘
          ↓
8. State transitions based on gameplay
   PlayingState → LevelTransitionState → PlayingState
                     ↓
               GameOverState
```

## 📡 Event System

### Game Events
```javascript
// Game flow
GAME_START, GAME_PAUSE, GAME_RESUME, GAME_OVER
LEVEL_START, LEVEL_COMPLETE

// Entities
PLAYER_DAMAGED, PLAYER_ATTACK
ENEMY_SHOOT, ENEMY_DESTROYED
STATUE_DAMAGED, STATUE_DESTROYED

// UI
UI_UPDATE, SCORE_UPDATE, LIVES_UPDATE, HEALTH_UPDATE
```

### Usage Example
```javascript
// Listen to event
eventBus.on(GAME_EVENTS.PLAYER_DAMAGED, (data) => {
    console.log('Player damaged! Lives:', data.lives);
});

// Emit event
eventBus.emit(GAME_EVENTS.PLAYER_DAMAGED, { lives: 2 });
```

## 🛠️ Specialized Managers

| Manager | Responsibility |
|---------|---------------|
| **AssetManager** | Loading and management of resources (images) |
| **UIManager** | DOM interaction, screens, buttons |
| **InputManager** | Keyboard and touch input capture and management |
| **CollisionManager** | Collision detection (AABB, Circle-Rect) |
| **ScoreManager** | Score calculation and bonuses |

## 🎮 Entities with Inheritance

```
Entity (abstract)
├── Player      → Movement, attack
├── Guard       → Patrol, shooting
├── Statue      → Target, health
└── Projectile  → Trajectory, collision
```

Common inherited methods:
- `update(deltaTime)` - Update logic
- `draw(ctx)` - Rendering
- `getHitbox()` - Get hitbox
- `destroy()` - Mark for deletion


## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Detailed architecture documentation
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**: Guide to extend the project
- **Source code**: All files have complete JSDoc

## 🔧 How to Extend the Project

### Add New Entity
1. Create class extending `Entity`
2. Implement `update()` and `draw()`
3. Add factory method in `EntityFactory`
4. Add configuration in `GameConfig.js`

### Add New State
1. Create class extending `GameState`
2. Implement `enter()`, `exit()`, `update()`, `draw()`
3. Add transitions where needed

### Add New Manager
1. Create class with single responsibility
2. Inject in `GameManager.injectDependencies()`
3. Use from components via `gameManager.yourManager`

**See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for complete examples.**

## 🎯 Installation and Usage

### Requirements
- Local web server (http-server, Live Server, etc.)
- Modern browser with ES6+ support

### Run
```bash
# With http-server (Node.js)
npx http-server

# With Python
python3 -m http.server

# With VS Code Live Server
# Right-click on index.html → Open with Live Server
```

Open browser at `http://localhost:8080` (or your port)

## 🎮 Controls

### Desktop
- **Movement**: Arrow keys or WASD
- **Attack**: Spacebar

### Mobile
- **Movement**: On-screen D-pad
- **Attack**: On-screen attack button
- Touch controls appear automatically on touch-enabled devices

## 🎨 Tech Stack

- **JavaScript ES6+**: Modules, classes, async/await
- **HTML5 Canvas**: 2D rendering
- **CSS3**: Styles and interface
- **Vanilla JS**: No external frameworks

---

**Developed by [Said Rahal](https://saidrahal.com) | [GitHub](https://github.com/srahalh/28J-GAME)**
