import React from 'react';
import { TextField, Button, Container, Typography, Box, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/system';

const theme = createTheme({
    palette: {
        primary: {
            main: '#90EE90',
        },
        background: {
            default: '#B8F4B8',
        },
        secondary: {
            main: '#DAF9DA'
        }
    },
});

const BackgroundContainer = styled(Container)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    width: '100%',
});

const RegisterBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[5],
    maxWidth: '400px',
    width: '100%',
});

const StyledTitle = styled(Typography)({
    marginBottom: theme.spacing(4),
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#616161',
});

const RegisterPage: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <BackgroundContainer maxWidth={false}>
                <StyledTitle variant="h6">
                    Igrači bez granica
                </StyledTitle>
                <RegisterBox>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lastName"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 1, textTransform: 'none', }}
                    >
                        Already have an account?
                    </Button>
                </RegisterBox>
            </BackgroundContainer>
        </ThemeProvider>
    );
};

export default RegisterPage;
