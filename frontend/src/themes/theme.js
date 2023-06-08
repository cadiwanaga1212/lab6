// import constants from './constants.js';

export const getDesignTokens = (mode) => ({
    shape: {
        borderRadius: 0,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { minWidth: 0 }
            }
        }
    },
    palette: {
        mode,
        ...(mode === 'light' ?
            {
                primary: {
                    // light: will be calculated from palette.primary.main,
                    main: '#A7CBFF',
                    // main: '#fff',
                    // contrastText: "#fff"
                },
                secondary: {
                    main: '#F1A7C1',
                },
                background: {
                    panel: '#e8e8e8',
                    paper: '#f5f5f5',
                    default: '#fff',
                    darkdefault: "#dfe0e4"
                },
                text: {
                    gray: '#aaa'
                }
            } :
            {
                // palette values for dark mode
                primary: {
                    // main: "#2fcd9a",
                    main: "#1e8b69",
                    dark: '#2baa76',
                    light: '#1e8b6930'
                },
                secondary: {
                    // main: '#ea6627',
                    main: '#AA0063'
                },
                background: {
                    panel: '#414141',
                    paper: '#414141',
                    default: '#292929',
                    darkdefault: "#333"
                },
                text: {
                    primary: "#e2e2e2",
                    gray: "#808080"
                }
            }
        )
    },
});