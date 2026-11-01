# Diamante Vivo ⚾

Resultados en vivo, posiciones por jornada, alineaciones, estadísticas, noticias y pronósticos de béisbol.
**Los datos son de demostración**: equipos, jugadores y resultados son ficticios.

## Requisitos
- Node.js 18 o superior

## Uso
```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción en /dist
npm run preview   # previsualizar el build
npm run lint      # ESLint
```

## Estructura
| Ruta | Contenido |
|---|---|
| `index.html` | HTML principal (Vite) |
| `src/main.js` | Lógica de la app (vistas, rutas por hash, simulación en vivo) |
| `src/legal.js` | Textos legales que muestra la app |
| `src/styles/main.css` | Estilos del diseño + directivas de Tailwind |
| `public/` | Archivos estáticos (favicon, robots.txt) |
| `legal/` | Textos legales en Markdown (para revisión) |
| `supabase/` | Migraciones y datos iniciales de la base de datos |
| `admin-standalone/` | Panel de administración independiente (un solo HTML) |

## Pendientes antes de publicar
- Reemplazar los marcadores `[RAZÓN SOCIAL]`, `[EMAIL DE CONTACTO]`, `[PAÍS / JURISDICCIÓN]`, etc. en `src/legal.js` y `legal/`.
- Conectar la analítica en `loadAnalytics()` (solo se ejecuta con consentimiento).
- Si tu hosting lo permite, añade la cabecera `Content-Security-Policy: upgrade-insecure-requests`.

## Supabase
Ver `supabase/migrations/0001_init.sql` y `supabase/seed.sql`. Con la CLI: `supabase db reset`.
