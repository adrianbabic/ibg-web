import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, createTheme, ThemeProvider, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';
import { registerUser } from '@/utils/api';
import Cookies from 'js-cookie';
import { validateEmail } from '@/utils/validation';

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
    marginBottom: theme.spacing(1),
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#616161',
});

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        userName: '',
        email: '',
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
        const { name, lastName, userName, email, password } = formData;

        if (!name || !lastName || !userName || !email || !password) {
            setError('Sva polja moraju biti popunjena!');
            return;
        }

        if (!validateEmail(email)) {
            setError('Unesi ispravnu email adresu');
            return;
        }

        try {
            const responseData = await registerUser(formData);
            // localStorage.setItem('token', responseData.token);
            Cookies.set('token', responseData.token, { expires: 1 });
            Cookies.set('userName', responseData.userName, { expires: 1 });
            router.push('/');
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <ThemeProvider theme={theme}>
            <BackgroundContainer maxWidth={false}>
                <RegisterBox>
                    {error && <Alert severity="error" sx={{ width: '100%', marginBottom: theme.spacing(2) }}>{error}</Alert>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Ime"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Prezime"
                        name="lastName"
                        autoComplete="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="Korisničko ime"
                        name="userName"
                        autoComplete="username"
                        value={formData.userName}
                        onChange={handleChange}
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
                        value={formData.email}
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
                        Registriraj se
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 1, textTransform: 'none' }}
                        onClick={handleLoginRedirect}
                    >
                        Već imaš račun?
                    </Button>
                </RegisterBox>
            </BackgroundContainer>
        </ThemeProvider>
    );
};

export default RegisterPage;
