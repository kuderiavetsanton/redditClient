module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        blue: {
          100: '#e6f2fb',
          200: '#cce4f6',
          300: '#b3d7f2',
          400: '##99c9ed',
          500: '#80bce9',
          600: '#66afe5',
          700: '#4da1e0',
          800: '#3394dc',
          900: '#1986d7',
        }
      },
      fontFamily:{
        body:['IBM Plex Sans','Noto Sans',' sans-serif'],
        noto:['Noto Sans',' sans-serif']
      },
      spacing:{
        160:'40rem'
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1780px',
        // => @media (min-width: 1536px) { ... }
      }
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [
    function({ addComponents }){
      addComponents({
        '.container-l':{
          width:`100%`,
          marginLeft:'auto',
          marginRight:'auto',
          '@screen sm':{ maxWidth: '640px' },
          '@screen md':{ maxWidth:'768px' },
          '@screen lg':{ maxWidth: '1000px'}
        }
      })
    }
  ],
}
  