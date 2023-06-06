
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getDesignTokens } from './themes/theme';
import { IconButton } from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import ScreenHandler from './ScreenHandler';

import lightBackgroundImage from '../src/images/light-background.png';
import darkBackgroundImage from '../src/images/dark-background.png';


let reached = false;
let adjusting = 0;

function App() {
  const [selectedScreen, setSelectedScreen] = React.useState(0);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState('light');

  React.useEffect(() => {
    if (localStorage.getItem('mode') !== null)
      setMode(localStorage.getItem('mode'));
    else
      setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  React.useEffect(() => {
    localStorage.setItem('mode', mode)
  }, [mode]);

  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
        // localStorage.setItem('mode', mode)
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const ColorModeContext = React.createContext({
    toggleColorMode: () => {
      // This is intentional
    }
  });

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}> 
        <CssBaseline />
        <div className={`App ${mode === 'light' ? 'light-mode' : 'dark-mode'}`}>
          <ScreenHandler />
          <IconButton
            style={{ zIndex: 5, color: "black", position: "absolute", top: 10, right: 10 }}
            onClick={colorMode.toggleColorMode}
            aria-label="delete"
          >
            {mode === 'light' ? <BedtimeIcon style={{color: 'rgb(11,0,66)'}}/> : <LightModeIcon style={{color: 'white'}}/>}
          </IconButton>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    
  );
}

export default App;
