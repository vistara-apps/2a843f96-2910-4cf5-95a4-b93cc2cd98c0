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
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        border: 'var(--color-border)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
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
