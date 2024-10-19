/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'geist-sans': ['var(--font-geist-sans)', 'sans-serif'], // Geist Sans fallback to sans-serif
        'geist-mono': ['var(--font-geist-mono)', 'monospace'],  // Geist Mono fallback to monospace
        'instrumental-sans': ['var(--font-instrumental-sans)', 'sans-serif'], // Instrumental Sans
        'instrumental-sans-italic': ['var(--font-instrumental-sans-italic)', 'sans-serif'], // Instrumental Sans Italic
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
