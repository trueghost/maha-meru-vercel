/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        optima: ['Optima LT Pro', 'sans-serif'],
        poppins: ['Poppins'],
        poppinsSB: ['PoppinsSB'],
        poppinsM: ['PoppinsM'],
        optimeB: ['Optima LT Pro Bold', 'sans-serif'],
        BDMsans: ['dm Sans'],
      },
      screens: {
        fb: '1024px',
        'below-1356': { max: '1356px' },
        'below-1276': { max: '1276px' },
        'below-1146': { max: '1146px' },
        'below-1192': { max: '1192px' },
        'below-1085': { max: '1085px' },
        'below-1030': { min: '1030px' },
        'below-640': { max: '640px' },
        'below-375': { max: '375px' },
        'above-1440': { min: '1440px' },
        'above-1900': { min: '1900px' },
        'below-2000': { max: '2000px' },
        'below-1800': { max: '1800px' },
        'below-1440': { max: '1440px' },
        'below-1275': { max: '1275px' },
        'below-1100': { max: '1100px' },
      },
      colors: {
        'hover-card-bottom-bg': 'rgba(230, 207, 183, 0.30)',
      },
      borderColor: {
        'neutral-border': 'var(--color-neutral-border, #E2E9E0)',
      },
      backgroundColor: {
        'white-30': 'rgba(255, 255, 255, 0.30)',
      },
      backdropBlur: {
        custom: '4.4px',
      },
      scale: {
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
        120: '1.2',
      },
      fontSize: {
        '1p35rem': '1.35rem',
        '1p6rem': '1.6rem',
      },

      keyframes: {
        fadeUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-50px) scale(0.5)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },

        'shrink-slide-up': {
          '0%': {
            transform:
              'scale(1) translateY(0)' /* Start at normal size and position */,
          },
          '100%': {
            transform: 'scale(0.8) translateY(-30px)' /* Shrink and move up */,
          },
        },

        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'fade-in-shrink-slide-up': {
          '0%': {
            opacity: '0',
            transform:
              'scale(1.5) translateY(20px)' /* Larger and below initial position */,
          },
          '100%': {
            opacity: '1',
            transform:
              'scale(1) translateY(0)' /* Normal size and original position */,
          },
        },
      },

      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        fadeOut: 'fadeOut 1s ease-in-out',
      },

      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'shrink-slide-up': 'shrink-slide-up 1s ease-out forwards',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s forwards',
        'fade-in': 'fadeIn 0.8s ease-in-out',
      },
      animation: {
        'fade-in-shrink-slide-up':
          'fade-in-shrink-slide-up 1s ease-out forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'banner-main': "url('/images/bgtexture.webp')",
        agriculture: "url('/images/agriculture/banner.png')",
        aerialview: "url('/images/second-section/aerialview.webp')",
        mobBanner: "url('/mobile-images/banner/farms.svg')",
        farm: "url('/mobile-images/banner/left.png')",
        'form-ground': "url('/images/products/groundImageMobile.png')",
        'mob-banner': "url('/mobile-images/mobileBanner.png')",
        mobb: "url('/mobile-images/mobileB.png')",
        'mobile-banner': "url('/images/Mobile_banner.webp')",
        
      },
    },
  },
  variants: {
    extend: {
      backgroundPosition: {
        'left-half': 'left',
        'right-half': 'right',
      },
      backgroundColor: ['hover'],
      borderColor: ['hover'],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none", // Hide scrollbar for Internet Explorer and Edge
          "scrollbar-width": "none",   // Hide scrollbar for Firefox
          "&::-webkit-scrollbar": {
            display: "none",           // Hide scrollbar for Chrome, Safari, and Opera
          },
        },
      });
    },
  ],
};
