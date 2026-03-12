# Architecture Documentation

See [README.md](./README.md) for a complete architecture overview.

## Key Points

- **5 Design Patterns**: Singleton, Observer, State, Factory, Facade
- **SOLID Principles**: All 5 applied
- **21 Files**: Organized in 7 directories
- **Complete JSDoc**: Every file documented

## Directory Structure

```
js/
├── config/       - Configuration
├── core/         - Core patterns (Singleton, Observer)
├── entities/     - Game entities with inheritance
├── factories/    - Entity creation (Factory pattern)
├── managers/     - Specialized managers (SRP)
├── states/       - Game states (State pattern)
└── Game.js       - Main facade
```

For detailed information, refer to the source code with JSDoc comments.
