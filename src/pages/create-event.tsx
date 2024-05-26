import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, MenuItem, Typography, createTheme, ThemeProvider, InputLabel, Select, SelectChangeEvent, FormHelperText } from '@mui/material';
import { useRouter } from 'next/router';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from '@/components/Navbar';
import { DateTimePicker } from '@mui/x-date-pickers';
import { StyledFormControl } from '@/styles/eventPageStyles';
import { CreateEventInfo, Location, Sport } from '@/utils/external';
import { createEvent, fetchLocations, fetchSports } from '@/utils/api';
import dayjs from 'dayjs';
import { Error } from '@mui/icons-material';

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
    const [formState, setFormState] = useState<CreateEventInfo>({
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
    const [validationError, setValidationError] = useState<string | null>(null);

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
        setValidationError(null);
        try {
            const num: number = parseInt(event.target.value);
            setFormState({
                ...formState,
                [event.target.name]: isNaN(num) ? event.target.value : num,
            });
        } catch (error) {
            setFormState({
                ...formState,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleDateChange = (date: any) => {
        setValidationError(null);
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm');
            setFormState({ ...formState, startTime: formattedDate });
        }
    };

    const handleSelectedSportChanged = (event: SelectChangeEvent) => {
        setValidationError(null);
        setSelectedSportId(event.target.value);
        setFormState({ ...formState, sportId: event.target.value });
    };

    const handleSelectedLocationChanged = (event: SelectChangeEvent) => {
        setValidationError(null);
        setSelectedLocationId(event.target.value);
        setFormState({ ...formState, locationId: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                await createEvent(formState);
                router.push('/my-events');
            } catch (error) {
                setValidationError("Nije moguće spremiti događaj, pokušajte ponovno");
            }
        }
    };

    const validateForm = () => {
        if (!formState.name) {
            setValidationError("Ime događaja ne smije biti prazno.");
            return false;
        }

        if (dayjs(formState.startTime).isBefore(dayjs())) {
            setValidationError("Datum i vrijeme početka moraju biti u budućnosti.");
            return false;
        }

        if (formState.currentPeople < 0) {
            setValidationError("Trenutan broj ljudi mora biti 0 ili veći.");
            return false;
        }

        if (formState.maxPeople < 1) {
            setValidationError("Maksimalan broj ljudi mora biti 1 ili veći.");
            return false;
        }

        if (formState.maxPeople <= formState.currentPeople) {
            setValidationError("Maksimalan broj ljudi mora biti veći od trenutnog broja ljudi.");
            return false;
        }

        if (!formState.locationId) {
            setValidationError("Lokacija mora biti odabrana.");
            return false;
        }

        if (!formState.sportId) {
            setValidationError("Sport mora biti odabran.");
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleReset = () => {
        setFormState({
            name: '',
            currentPeople: 0,
            maxPeople: 0,
            locationId: '',
            sportId: '',
            locked: false,
            startTime: dayjs().add(1, 'day').format('YYYY-MM-DDT20:00'),
        });
        setSelectedSportId('');
        setSelectedLocationId('');
        setValidationError(null);
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
                            <StyledFormControl variant="outlined" fullWidth style={{ marginBottom: 60 }}>
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
                            {!!validationError && (
                                <FormHelperText error>
                                    <Typography variant="body1" component="span" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Error fontSize="small" style={{ marginRight: '8px' }} />
                                        {validationError}
                                    </Typography>
                                </FormHelperText>
                            )}
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
