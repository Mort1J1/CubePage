// src/Utils/Theme.jsx
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    light: {
      bg: 'radial-gradient(circle, rgb(142, 142, 170) 0%, rgb(101, 103, 116) 0%, rgba(173, 169, 221, 0.892) 100%)',
      game: 'radial-gradient(circle, rgb(142, 142, 70) 0%, rgb(101, 103, 116) 0%, rgba(173, 169, 221, 0.892) 100%)',
      text: 'black',
      transition: "background-image 1.3s ease-in-out",
    },
    dark: {
      bg: 'radial-gradient(circle, rgba(59,42,66,1) 0%, rgba(7,14,32,1) 35%, rgba(2,3,25,0.9360337885154062) 73%, rgba(19,18,16,1) 100%)',
      game: 'radial-gradient(circle, rgb(142, 142, 70) 0%, rgb(101, 103, 116) 0%, rgba(173, 169, 221, 0.892) 100%)',
      text: 'white',
      transition: "background-image 1.3s ease-in-out",

    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? theme.colors.dark.bg : theme.colors.light.bg,
        color: props.colorMode === 'dark' ? theme.colors.dark.text : theme.colors.light.text,
        transition: 'background-image 1.3s ease-in-out',
      },
      ':root': {
        '--games-bg': props.colorMode === 'dark' ? theme.colors.dark.game : theme.colors.light.game,
      },
    }),
  },
});

export default theme;
