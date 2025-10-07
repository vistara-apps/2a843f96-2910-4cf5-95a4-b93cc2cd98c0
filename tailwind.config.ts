import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg))',
        fg: 'hsl(var(--color-fg))',
        accent: 'hsl(var(--color-accent))',
        'accent-soft': 'hsl(var(--color-accent-soft))',
        border: 'hsl(var(--color-border))',
        surface: 'hsl(var(--color-surface))',
        muted: 'hsl(var(--color-muted))',
        error: 'hsl(var(--color-error))',
        success: 'hsl(var(--color-success))',
        warning: 'hsl(var(--color-warning))',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 4px 16px hsla(222, 47%, 11%, 0.08)',
        'card-hover': '0 8px 24px hsla(222, 47%, 11%, 0.12)',
        drawer: '0 -4px 24px hsla(222, 47%, 11%, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
