import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './Utils/Theme';
import { ChakraProvider, ColorModeScript} from '@chakra-ui/react';
import { SoundProvider } from './Utils/SoundProvider';
import { MenuProvider } from './Utils/MenuProvider';

// Redirect HTTP to HTTPS
// if (window.location.protocol === 'http:') {
//   window.location.href = `https://${window.location.host}${window.location.pathname}${window.location.search}`;
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MenuProvider>
  <SoundProvider>
  <ChakraProvider theme={theme}>
  <ColorModeScript initialColorMode={theme.config.initialColorMode} />

  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ChakraProvider>
  </SoundProvider>
  </MenuProvider>
);
document.getElementById('root')

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
