# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.0.0] - 2026-10-31

### Añadido
- Proyecto Vite + Tailwind CSS a partir del HTML único "Diamante Vivo".
- Separación del código en `src/main.js`, `src/legal.js` y `src/styles/main.css`.
- Textos legales en `legal/` (aviso legal, privacidad, cookies, términos).
- Esquema de base de datos y datos iniciales en `supabase/`.
- Panel `admin-standalone/` para editar marcadores.

### Eliminado
- Cuadro azul/dorado semitransparente que se expandía en el fondo (`body::before`, `body::after` y la animación `drift`).
