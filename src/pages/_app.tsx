import React from 'react';
import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

const theme = createTheme();

const App = ({ Component, pageProps }: AppProps) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{
            body: {
                margin: 0,
                padding: 0
            },
            '#__next': {
                margin: 0,
                padding: 0,
                width: '100vw',
                height: '100vh',
            }
        }} />
        <Component {...pageProps} />
    </ThemeProvider>
);

export default App;
