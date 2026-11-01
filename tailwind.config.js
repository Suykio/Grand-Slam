/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  // Preflight desactivado: el diseño ya trae sus propios estilos base (src/styles/main.css).
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: { dv: { blue: '#02189e', gold: '#fecb02' } },
      fontFamily: {
        disp: ['Unbounded', 'Trebuchet MS', 'sans-serif'],
        body: ['Figtree', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
