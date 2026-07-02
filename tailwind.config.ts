import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        border: 'var(--border)'
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'heaven-gradient':
          'radial-gradient(120% 90% at 15% 0%, rgba(168, 198, 224, 0.35) 0%, transparent 55%), radial-gradient(120% 90% at 85% 10%, rgba(201, 169, 97, 0.22) 0%, transparent 55%), radial-gradient(140% 100% at 50% 100%, rgba(253, 246, 233, 0.9) 0%, transparent 60%)'
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(93, 77, 46, 0.15)',
        card: '0 4px 24px -6px rgba(93, 77, 46, 0.12)'
      }
    }
  },
  plugins: []
}

export default config
