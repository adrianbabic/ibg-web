import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, MenuItem, Typography, createTheme, ThemeProvider, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from '@/components/Navbar';
import { DateTimePicker } from '@mui/x-date-pickers';
import { StyledFormControl } from '@/styles/eventPageStyles';
import { Location, Sport } from '@/utils/external';
import { fetchLocations, fetchSports } from '@/utils/api';
import dayjs from 'dayjs';

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
        locationId: '',
        sportId: '',
        locked: false,
        startTime: dayjs().add(1, 'day').format('YYYY-MM-DDT20:00'),
    });
    const [selectedSportId, setSelectedSportId] = useState<string>("");
    const [sports, setSports] = useState<Sport[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>("");
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const getSports = async () => {
            try {
                const sportsData = await fetchSports();
                setSports(sportsData);
            } catch (error) {
                console.error('Pogreska pri dohvacanju sportova:', error);
            }
        };

        const getLocations = async () => {
            try {
                const locationsData = await fetchLocations();
                setLocations(locationsData);
            } catch (error) {
                console.error('Pogreska pri dohvacanju lokacija:', error);
            }
        };

        getSports();
        getLocations();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        });
    };

    const handleDateChange = (date: any) => {
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm');
            setFormState({ ...formState, startTime: formattedDate });
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Typically you would send the data to your server here
        console.log(formState);
        // router.push('/my-events');
    };

    const handleReset = () => {
        setFormState({
            name: '',
            currentPeople: 0,
            maxPeople: 0,
            locationId: '',
            sportId: '',
            locked: false,
            startTime: dayjs().toISOString()
        });
        setSelectedSportId('');
        setSelectedLocationId('');
    };

    const handleSelectedSportChanged = (event: SelectChangeEvent) => {
        setSelectedSportId(event.target.value);
        setFormState({ ...formState, sportId: event.target.value });
    };

    const handleSelectedLocationChanged = (event: SelectChangeEvent) => {
        setSelectedLocationId(event.target.value);
        setFormState({ ...formState, locationId: event.target.value });
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
                                    format='DD/MM/YYYY HH:mm'
                                    value={dayjs(formState.startTime)}
                                    onChange={handleDateChange}
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
                        <Grid item xs={12} md={4}>
                            <StyledFormControl variant="outlined" fullWidth style={{ marginBottom: 40 }}>
                                <InputLabel id="location-dropdown-label">Lokacija</InputLabel>
                                <Select
                                    labelId="location-dropdown-label"
                                    value={selectedLocationId}
                                    onChange={handleSelectedLocationChanged}
                                    label="Lokacija"
                                >
                                    <MenuItem value="">
                                        <em>-</em>
                                    </MenuItem>
                                    {locations.map((location) => (
                                        <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl>
                            <StyledFormControl variant="outlined" fullWidth style={{ marginBottom: 40 }}>
                                <InputLabel id="sport-dropdown-label">Sport</InputLabel>
                                <Select
                                    labelId="sport-dropdown-label"
                                    value={selectedSportId}
                                    onChange={handleSelectedSportChanged}
                                    label="Sport"
                                >
                                    <MenuItem value="">
                                        <em>-</em>
                                    </MenuItem>
                                    {sports.map((sport) => (
                                        <MenuItem key={sport.id} value={sport.id}>{sport.name}</MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl>
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
