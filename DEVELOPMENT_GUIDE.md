# Development Guide

## Adding New Features

### New Entity
1. Extend `Entity` class
2. Implement `update()` and `draw()`
3. Add factory method in `EntityFactory`
4. Add config in `GameConfig.js`

### New State
1. Extend `GameState` class
2. Implement `enter()`, `exit()`, `update()`, `draw()`
3. Add transitions

### New Manager
1. Create class with single responsibility
2. Inject in `GameManager.injectDependencies()`
3. Use via `gameManager.yourManager`

## Best Practices

- **Naming**: PascalCase classes, camelCase methods, UPPER_SNAKE_CASE constants
- **JSDoc**: Document all public methods
- **Events**: Use EventBus for component communication
- **Config**: Centralize in GameConfig.js

## Code Example

```javascript
// entities/Bomb.js
import Entity from './Entity.js';

export default class Bomb extends Entity {
    constructor(gameManager, x, y) {
        super(gameManager, x, y, width, height);
    }
    
    update(deltaTime) {
        // Your logic
    }
    
    draw(ctx) {
        // Your rendering
    }
}
```

See source code for more examples with complete JSDoc.
