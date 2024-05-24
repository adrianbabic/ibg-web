import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, createTheme, ThemeProvider, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';
import { loginUser } from '../utils/api';
import Cookies from 'js-cookie';

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

const LoginBox = styled(Box)({
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
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#616161',
});

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };

    const handleSubmit = async () => {
        const { username, password } = formData;

        if (!username || !password) {
            setError('Both fields must not be empty');
            return;
        }

        try {
            const responseData = await loginUser({ username, password });
            // localStorage.setItem('token', responseData.token);
            Cookies.set('token', responseData.token, { expires: 1 });
            router.push('/');
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleRegisterRedirect = () => {
        router.push('/register');
    };

    return (
        <ThemeProvider theme={theme}>
            <BackgroundContainer maxWidth={false}>
                <StyledTitle variant="h6">
                    Igrači bez granica
                </StyledTitle>
                <LoginBox>
                    {error && <Alert severity="error" sx={{ width: '100%', marginBottom: theme.spacing(2) }}>{error}</Alert>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Korisničko ime"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Lozinka"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, textTransform: 'none' }}
                        onClick={handleSubmit}
                    >
                        Ulogiraj se
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 1, textTransform: 'none' }}
                        onClick={handleRegisterRedirect}
                    >
                        Registriraj se
                    </Button>
                </LoginBox>
            </BackgroundContainer>
        </ThemeProvider>
    );
};

export default LoginPage;
