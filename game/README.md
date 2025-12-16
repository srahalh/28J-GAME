# Cómo ejecutar el juego

## Problema
El juego usa módulos ES6 de JavaScript, que los navegadores bloquean cuando se abren directamente desde el sistema de archivos (`file://`) por razones de seguridad CORS.

## Solución
Debes ejecutar el juego a través de un servidor HTTP local.

### Opción 1: Servidor Python (Recomendado)
1. Abre una terminal
2. Navega al directorio del juego:
   ```bash
   cd /Users/srahalh/Documents/Proyectos/game
   ```
3. Ejecuta el servidor:
   ```bash
   python3 -m http.server 8000
   ```
4. Abre tu navegador y ve a: **http://localhost:8000/index.html**

### Opción 2: Servidor Node.js
Si tienes Node.js instalado:
```bash
npx http-server -p 8000
```

### Opción 3: Extensión de VS Code
Si usas VS Code, instala la extensión "Live Server" y haz clic derecho en `index.html` → "Open with Live Server"

## Controles del juego
- **Flechas** o **WASD**: Mover al jugador
- **ESPACIO**: Golpear la estatua con el martillo

## Objetivo
Derriba la estatua antes de que los guardias te capturen. ¡Tienes 3 vidas!
