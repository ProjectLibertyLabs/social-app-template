/** @type {import('tailwindcss').Config} */

import { MAX_PAGE_WIDTH } from './src/lib/consts';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      title: ['Newake', 'sans-serif'],
      sans: ['Poppins', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      disabled: '#BCBAC0',
      cream: '#FEFAF3',
      navy: '#19455E',
      yellow: '#FFD747',
      teal: '#4BA0A5',
      tealBright: '#00B6AF',
      purple: '#2B2F6E',
      orange: '#F87C48',
      indigo: '#5E69FF',
      darkIndigo: '#445BC3',
      rose: '#A06B87',
    },
    width: {
      page: `${MAX_PAGE_WIDTH}px`,
      full: '100%',
    },
    maxWidth: {
      page: `${MAX_PAGE_WIDTH}px`,
      full: '100%',
    },
    minWidth: {
      page: `${MAX_PAGE_WIDTH}px`,
      full: '100%',
    },
    extend: {
      fontSize: {
        xs: '14px',
        sm: '16px',
        base: '18px',
        lg: '20px',
        xl: '25px',
        '2xl': '30px',
        75: '75px',
        100: '100px',
        200: '200px',
      },
    },
    screens: {
      sm: '0px',
      md: '900px',
      lg: '1300px',
      xl: `${MAX_PAGE_WIDTH}px`,
      'vertical-lg': { raw: '(max-height: 700px) and (min-width: 1300px)' },
      'vertical-md': { raw: '(max-height: 700px) and (min-width: 900px)' },
      vertical: { raw: '(max-height: 700px) or (min-width: 0px)' },
      horizontal: { raw: '(min-height: 700px) and (min-width: 1300px)' },
    },
  },
  safelist: ['after:bg-navy', 'after:bg-cream'],
};
