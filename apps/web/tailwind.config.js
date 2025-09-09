/** @type {import('tailwindcss').Config} */
// apps/web/tailwind.config.js

module.exports = {
  content: [
    // Caminhos para os arquivos da sua aplicação web
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "../../packages/ui/src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-roxo": "#3D3C6C",
        "primary-hover": "#373661",
        "dark-roxo": "#151526",
        "light-roxo": "#ECECF0",
        "light-hover": "#E2E2E9",
      },
    },
  },
  plugins: [],
};
