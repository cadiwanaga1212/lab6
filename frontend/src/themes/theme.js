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
                    main: 'rgba(167, 203, 255, .7)',
                    // main: '#fff',
                    // contrastText: "#fff"
                },
                secondary: {
                    main: 'rgba(241, 167, 193, .95)',
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
                    main: "rgba(30, 139, 105, .7)",
                    dark: '#2baa76',
                    light: '#1e8b6930'
                },
                secondary: {
                    // main: '#ea6627',
                    main: 'rgba(170, 0, 99, .95)'
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