import type { Config } from "tailwindcss";

// Los colores leen las variables definidas en src/app/globals.css (canales RGB),
// así la paleta se cambia en un solo lugar y las clases con opacidad (text-ink/60) siguen funcionando.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: token('ink'),
        soft: token('ink-2'),
        mute: token('ink-3'),
        line: token('line'),
        brand: { DEFAULT: token('brand'), hover: token('brand-hover'), soft: token('brand-soft'), deep: token('brand-deep') },
        ok: token('ok'),
        warn: token('warn'),
        danger: token('danger'),
        violet: token('violet'),
        'ok-ink': token('ok-ink'),
        'danger-ink': token('danger-ink'),
        'warn-ink': token('warn-ink'),
        'violet-ink': token('violet-ink'),
      },
      borderRadius: {
        card: 'var(--r-card)',
        ctl: 'var(--r-ctl)',
      },
      boxShadow: {
        glass: 'var(--shadow-card)',
        'glass-sm': 'var(--shadow-sm)',
      },
    },
  },
  plugins: [],
};
export default config;
