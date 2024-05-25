import React, { useState } from 'react';
import { Button, TextField, Grid, MenuItem, Typography, createTheme, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/router';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from '@/components/Navbar';
import { DateTimePicker } from '@mui/x-date-pickers';

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

const MyForm: React.FC = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        name: '',
        currentPeople: 0,
        maxPeople: 0,
        location: '',
        sport: '',
        startTime: new Date(),
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        });
    };

    const handleDateChange = (date: Date | null) => {
        setFormState({ ...formState, startTime: date || new Date() });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Typically you would send the data to your server here
        console.log(formState);
        router.push('/my-events');
    };

    const handleReset = () => {
        setFormState({
            name: '',
            currentPeople: 0,
            maxPeople: 0,
            location: '',
            sport: '',
            startTime: new Date()
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Navbar />
                <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
                    <Typography variant="h6" style={{ marginBottom: 50 }}>
                        Unesi podatke za stvaranje novog događaja
                    </Typography>
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Ime događaja"
                                name="name"
                                value={formState.name}
                                onChange={handleInputChange}
                                style={{ marginBottom: 40, width: '80%' }}
                            />
                            <div style={{ marginBottom: 40, width: '80%' }} >
                                <DateTimePicker
                                    label="Datum i vrijeme početka"
                                    ampm={false}
                                    disablePast={true}
                                    format='DD/MM/YYYY hh:mm'
                                // value={formState.startTime}
                                // onChange={handleDateChange}
                                // renderInput={(params: any) => <TextField {...params} fullWidth style={{ marginBottom: 10 }} />}
                                />
                            </div>
                            <TextField
                                label="Trenutan broj ljudi"
                                type="number"
                                name="currentPeople"
                                value={formState.currentPeople}
                                onChange={handleInputChange}
                                style={{ width: '30%', marginRight: '2%', marginBottom: 10 }}
                            />
                            <TextField
                                label="Maksimalan broj ljudi"
                                type="number"
                                name="maxPeople"
                                value={formState.maxPeople}
                                onChange={handleInputChange}
                                style={{ width: '30%', marginBottom: 10 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="Lokacija"
                                name="location"
                                value={formState.location}
                                onChange={handleInputChange}
                                style={{ marginBottom: 40 }}
                            >
                                <MenuItem value="Location1">Location1</MenuItem>
                                <MenuItem value="Location2">Location2</MenuItem>
                                <MenuItem value="Location3">Location3</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                select
                                label="Sport"
                                name="sport"
                                value={formState.sport}
                                onChange={handleInputChange}
                                style={{ marginBottom: 40 }}
                            >
                                <MenuItem value="Sport1">Sport1</MenuItem>
                                <MenuItem value="Sport2">Sport2</MenuItem>
                                <MenuItem value="Sport3">Sport3</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: 20 }}>
                        <Grid item xs={5}>
                            <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', width: '30%', marginRight: "30px" }}>
                                Spremi
                            </Button>
                            <Button onClick={handleReset} variant="contained" color="secondary"
                                sx={{ textTransform: 'none', width: '30%' }}>
                                Resetiraj
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default MyForm;
