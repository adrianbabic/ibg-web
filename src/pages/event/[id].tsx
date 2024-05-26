import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, MenuItem, Typography, createTheme, ThemeProvider, InputLabel, Select, SelectChangeEvent, FormHelperText } from '@mui/material';
import { useRouter } from 'next/router';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from '@/components/Navbar';
import { DateTimePicker } from '@mui/x-date-pickers';
import { StyledFormControl } from '@/styles/eventPageStyles';
import { CreateEventInfo, Location, Sport, SportEvent } from '@/utils/external';
import { createEvent, fetchEventById, fetchLocations, fetchSports, joinEvent } from '@/utils/api';
import dayjs from 'dayjs';
import { Error } from '@mui/icons-material';
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

const EventPage: React.FC = () => {
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
    const [sportEvent, setSportEvent] = useState<SportEvent | null>(null);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

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

    useEffect(() => {
        const getEventById = async (id: string | string[] | undefined) => {
            try {
                if (id && !Array.isArray(id)) {
                    const sportEventData = await fetchEventById(id);
                    setSportEvent(sportEventData);
                    setValidationError(null);
                } else {
                    setValidationError("Predan je id događaja koji ne postoji!");
                }
            } catch (error) {
                setValidationError("Pogreska pri dohvaćanju događaja pomoću id");
                console.error('Pogreska pri dohvacanju sportova:', error);
            }
        };

        const { id } = router.query;
        getEventById(id);

    }, [router.query]);

    useEffect(() => {
        if (sportEvent) {
            setSelectedLocationId(sportEvent.location.id);
            setSelectedSportId(sportEvent.sport.id);
            setFormState({
                name: sportEvent.name,
                currentPeople: sportEvent.currentPeople,
                maxPeople: sportEvent.maxPeople,
                locationId: sportEvent.location.id,
                sportId: sportEvent.sport.id,
                locked: false,
                startTime: sportEvent.startTime
            });
            const userName = Cookies.get("userName");
            if (userName == sportEvent.eventOwner.name)
                setIsOwner(true);
            else
                setIsOwner(false);
        }

    }, [sportEvent]);

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
            console.log(formState);
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

    const isUserInSportEvent = (): boolean => {
        if (sportEvent) {
            const userName = Cookies.get("userName");

            if (!userName || !sportEvent.playersViaApp) {
                return false;
            }

            return sportEvent.playersViaApp.some(player => player.userName === userName);
        }
        return false;
    }

    const isMatchFull = (): boolean => {
        if (sportEvent) {
            return sportEvent.currentPeople >= sportEvent.maxPeople;
        }
        return false;
    }

    const handleJoinButtonClicked = async () => {
        if (sportEvent) {
            try {
                await joinEvent(sportEvent.id);
                router.push(`/event/${sportEvent.id}`);
            } catch (error) {
                setValidationError("Nije moguće pridružiti se događaju");
            }
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Navbar />
                <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
                    <Typography variant="h6" style={{ marginBottom: 50 }}>
                        Informacije o događaju
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
                                disabled={isDisabled}
                            />
                            <div style={{ marginBottom: 40, width: '80%' }} >
                                <DateTimePicker
                                    label="Datum i vrijeme početka"
                                    ampm={false}
                                    disablePast={true}
                                    format='DD/MM/YYYY HH:mm'
                                    value={dayjs(formState.startTime)}
                                    onChange={handleDateChange}
                                    disabled={isDisabled}
                                />
                            </div>
                            <TextField
                                label="Trenutan broj ljudi"
                                type="number"
                                name="currentPeople"
                                value={formState.currentPeople}
                                onChange={handleInputChange}
                                style={{ width: '30%', marginRight: '2%', marginBottom: 10 }}
                                disabled={isDisabled}
                            />
                            <TextField
                                label="Maksimalan broj ljudi"
                                type="number"
                                name="maxPeople"
                                value={formState.maxPeople}
                                onChange={handleInputChange}
                                style={{ width: '30%', marginBottom: 10 }}
                                disabled={isDisabled}
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
                                    disabled={isDisabled}
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
                                    disabled={isDisabled}
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
                        {isOwner && (
                            <Grid item xs={5}>
                                <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', width: '30%', marginRight: "30px" }}>
                                    Spremi
                                </Button>
                                <Button onClick={handleReset} variant="contained" color="secondary"
                                    sx={{ textTransform: 'none', width: '30%' }}>
                                    Resetiraj
                                </Button>
                            </Grid>
                        )}
                        {!isOwner && (
                            <Grid item xs={5}>
                                {isUserInSportEvent() && (
                                    <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', width: '30%', marginRight: "30px" }} disabled={true}>
                                        Već ste pridruženi ovom događaju
                                    </Button>
                                )}
                                {!isUserInSportEvent() && isMatchFull() && (
                                    <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', width: '30%', marginRight: "30px" }} disabled={true}>
                                        Događaj je popunjen
                                    </Button>
                                )}
                                {!isUserInSportEvent() && sportEvent?.locked && (
                                    <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', width: '30%', marginRight: "30px" }} disabled={true}>
                                        Događaj je zaključan
                                    </Button>
                                )}
                                {!isUserInSportEvent() && !isMatchFull() && !sportEvent?.locked && (
                                    <Button onClick={handleJoinButtonClicked} variant="contained" color="primary" sx={{ textTransform: 'none', width: '30%', marginRight: "30px" }} >
                                        Pridruži se događaju
                                    </Button>
                                )}
                            </Grid>
                        )}
                    </Grid>
                </form>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default EventPage;
