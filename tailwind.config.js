/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // ─── COLORS ──────────────────────────────────────────────────────────
      colors: {
        brand: {
          DEFAULT:  'var(--color-brand)',
          hover:    'var(--color-brand-hover)',
          subtle:   'var(--color-brand-subtle)',
          muted:    'var(--color-brand-muted)',
          border:   'var(--color-brand-border)',
          text:     'var(--color-brand-text)',
        },
        accent: {
          DEFAULT:  'var(--color-accent)',
          hover:    'var(--color-accent-hover)',
          subtle:   'var(--color-accent-subtle)',
          muted:    'var(--color-accent-muted)',
          border:   'var(--color-accent-border)',
          text:     'var(--color-accent-text)',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          150: '#EFEFEF',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        surface: {
          base:   'var(--color-surface-base)',
          raised: 'var(--color-surface-raised)',
          sunken: 'var(--color-surface-sunken)',
        },
        content: {
          primary:   'var(--color-content-primary)',
          secondary: 'var(--color-content-secondary)',
          tertiary:  'var(--color-content-tertiary)',
          disabled:  'var(--color-content-disabled)',
          inverse:   'var(--color-content-inverse)',
          link:      'var(--color-content-link)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          muted:   'var(--color-border-muted)',
          strong:  'var(--color-border-strong)',
        },
        semantic: {
          success: {
            light:   'var(--color-success-light)',
            DEFAULT: 'var(--color-success)',
            dark:    'var(--color-success-dark)',
          },
          warning: {
            light:   'var(--color-warning-light)',
            DEFAULT: 'var(--color-warning)',
            dark:    'var(--color-warning-dark)',
          },
          error: {
            light:   'var(--color-error-light)',
            DEFAULT: 'var(--color-error)',
            dark:    'var(--color-error-dark)',
          },
          info: {
            light:   'var(--color-info-light)',
            DEFAULT: 'var(--color-info)',
            dark:    'var(--color-info-dark)',
          },
        },
      },

      // ─── TYPOGRAPHY ──────────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)',    'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs:   ['clamp(0.70rem, 0.68rem + 0.10vw, 0.75rem)',  { lineHeight: '1rem' }],
        sm:   ['clamp(0.82rem, 0.80rem + 0.12vw, 0.875rem)', { lineHeight: '1.25rem' }],
        base: ['clamp(0.95rem, 0.92rem + 0.15vw, 1rem)',     { lineHeight: '1.5rem' }],
        lg:   ['clamp(1.05rem, 1.01rem + 0.20vw, 1.125rem)', { lineHeight: '1.75rem' }],
        xl:   ['clamp(1.18rem, 1.13rem + 0.25vw, 1.25rem)',  { lineHeight: '1.75rem' }],
        '2xl':['clamp(1.38rem, 1.30rem + 0.40vw, 1.5rem)',   { lineHeight: '2rem' }],
        '3xl':['clamp(1.6rem,  1.50rem + 0.50vw, 1.875rem)', { lineHeight: '2.25rem' }],
        '4xl':['clamp(2rem,    1.85rem + 0.75vw, 2.25rem)',  { lineHeight: '2.5rem' }],
        '5xl':['clamp(2.4rem,  2.20rem + 1.00vw, 3rem)',     { lineHeight: '1.1' }],
        '6xl':['clamp(2.9rem,  2.60rem + 1.50vw, 3.75rem)',  { lineHeight: '1' }],
      },
      fontWeight: {
        light:     '300',
        regular:   '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
        extrabold: '800',
      },

      // ─── SPACING (4px base grid) ─────────────────────────────────────────
      spacing: {
        0.5: '2px',
        1:   '4px',
        1.5: '6px',
        2:   '8px',
        2.5: '10px',
        3:   '12px',
        3.5: '14px',
        4:   '16px',
        5:   '20px',
        6:   '24px',
        7:   '28px',
        8:   '32px',
        9:   '36px',
        10:  '40px',
        11:  '44px',
        12:  '48px',
        13:  '52px',
        14:  '56px',
        16:  '64px',
        20:  '80px',
        24:  '96px',
        28:  '112px',
        32:  '128px',
        36:  '144px',
        40:  '160px',
        48:  '192px',
        56:  '224px',
        64:  '256px',
      },

      // ─── BORDER RADIUS ───────────────────────────────────────────────────
      borderRadius: {
        none:  '0px',
        xs:    '4px',
        sm:    '6px',
        md:    '10px',
        lg:    '16px',
        xl:    '24px',
        '2xl': '32px',
        '3xl': '48px',
        full:  '9999px',
      },

      // ─── BOX SHADOW ──────────────────────────────────────────────────────
      boxShadow: {
        xs:   '0 1px 2px 0 var(--shadow-color, rgba(0,0,0,0.05))',
        sm:   '0 1px 3px 0 var(--shadow-color, rgba(0,0,0,0.08)), 0 1px 2px -1px var(--shadow-color, rgba(0,0,0,0.06))',
        md:   '0 4px 6px -1px var(--shadow-color, rgba(0,0,0,0.08)), 0 2px 4px -2px var(--shadow-color, rgba(0,0,0,0.06))',
        lg:   '0 10px 15px -3px var(--shadow-color, rgba(0,0,0,0.08)), 0 4px 6px -4px var(--shadow-color, rgba(0,0,0,0.06))',
        xl:   '0 20px 25px -5px var(--shadow-color, rgba(0,0,0,0.08)), 0 8px 10px -6px var(--shadow-color, rgba(0,0,0,0.06))',
        '2xl':'0 25px 50px -12px var(--shadow-color, rgba(0,0,0,0.15))',
        // Focus ring shadows — web/Expo Web only; border-color change is the RN indicator
        'focus-brand':   '0 0 0 3px var(--color-brand-border)',
        'focus-error':   '0 0 0 3px var(--color-error-light)',
        'focus-success': '0 0 0 3px var(--color-success-light)',
      },

      // ─── TRANSITIONS ─────────────────────────────────────────────────────
      transitionTimingFunction: {
        out:     'cubic-bezier(0, 0, 0.2, 1)',
        spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'in-out':'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        instant: '50ms',
        fast:    '100ms',
        normal:  '200ms',
        slow:    '300ms',
        slower:  '500ms',
      },

      // ─── Z-INDEX ─────────────────────────────────────────────────────────
      zIndex: {
        base:    '0',
        raised:  '10',
        dropdown:'20',
        sticky:  '30',
        fixed:   '40',
        overlay: '50',
        modal:   '60',
        popover: '70',
        tooltip: '80',
        toast:   '90',
        top:     '100',
      },
    },
  },
  plugins: [],
}
