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
      // Note: hardcoded hex values (not var()) — react-native-css-interop@0.1.x
      // does not resolve CSS custom properties in React Native StyleSheet.
      colors: {
        brand: {
          DEFAULT:  '#0EA5E9',  // sky-500
          hover:    '#0284C7',  // sky-600
          subtle:   '#F0F9FF',  // sky-50
          muted:    '#BAE6FD',  // sky-200
          border:   '#7DD3FC',  // sky-300
          text:     '#0369A1',  // sky-700
        },
        accent: {
          DEFAULT:  '#0284C7',  // sky-600
          hover:    '#0369A1',  // sky-700
          subtle:   '#E0F2FE',  // sky-100
          muted:    '#BAE6FD',  // sky-200
          border:   '#38BDF8',  // sky-400
          text:     '#075985',  // sky-800
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
          base:   '#FFFFFF',
          raised: '#FAFAFA',
          sunken: '#F5F5F5',
        },
        content: {
          primary:   '#171717',
          secondary: '#404040',
          tertiary:  '#737373',
          disabled:  '#A3A3A3',
          inverse:   '#FFFFFF',
          link:      '#0EA5E9',  // sky-500
        },
        border: {
          DEFAULT: '#E5E5E5',
          muted:   '#F5F5F5',
          strong:  '#A3A3A3',
        },
        semantic: {
          success: {
            light:   '#DCFCE7',
            DEFAULT: '#16A34A',
            dark:    '#14532D',
          },
          warning: {
            light:   '#FEF9C3',
            DEFAULT: '#CA8A04',
            dark:    '#713F12',
          },
          error: {
            light:   '#FEE2E2',
            DEFAULT: '#DC2626',
            dark:    '#7F1D1D',
          },
          info: {
            light:   '#DBEAFE',
            DEFAULT: '#2563EB',
            dark:    '#1E3A8A',
          },
        },
      },

      // ─── TYPOGRAPHY ──────────────────────────────────────────────────────
      fontFamily: {
        display: ['PlusJakartaSans_700Bold'],
        body:    ['PlusJakartaSans_400Regular'],
        mono:    ['Courier New'],
      },
      fontSize: {
        xs:   ['12px',  { lineHeight: '16px'   }],
        sm:   ['14px',  { lineHeight: '20px'   }],
        base: ['16px',  { lineHeight: '24px'   }],
        lg:   ['18px',  { lineHeight: '28px'   }],
        xl:   ['20px',  { lineHeight: '28px'   }],
        '2xl':['24px',  { lineHeight: '32px'   }],
        '3xl':['30px',  { lineHeight: '36px'   }],
        '4xl':['36px',  { lineHeight: '40px'   }],
        '5xl':['48px',  { lineHeight: '52px'   }],
        '6xl':['60px',  { lineHeight: '60px'   }],
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
