import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Box, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Location, Sport, SportEvent } from '@/utils/external';
import { fetchLocations, fetchMyEvents, fetchMyFilteredEvents, fetchSports } from '@/utils/api';
import EventCard from '@/components/EventCard';
import { HorizontalBar, StyledButton, StyledFormControl } from '@/styles/eventPageStyles';
import Link from 'next/link';
import { useRouter } from 'next/router';


const MyEvents: React.FC = () => {
    const router = useRouter();

    const [firstDropdown, setFirstDropdown] = useState('');
    const [sportEvents, setSportEvents] = useState<SportEvent[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);
    const [selectedSportId, setSelectedSportId] = useState<string>("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>("");

    useEffect(() => {
        const getSports = async () => {
            try {
                const sportsData = await fetchSports();
                setSports(sportsData);
            } catch (error) {
                console.error('Pogreska pri dohvacanju sportova:', error);
            }
        };

        const getEvents = async () => {
            try {
                const eventsData = await fetchMyEvents();
                setSportEvents(eventsData.content);
            } catch (error) {
                console.error('Pogreska pri dohvacanju mojih dogadaja:', error);
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
        getEvents();
        getLocations();
    }, []);

    // useEffect(() => {
    //     const getFilteredEvents = async () => {
    //         try {
    //             const eventsData = await fetchMyFilteredEvents();
    //             setSportEvents(eventsData.content);
    //         } catch (error) {
    //             console.error('Pogreska pri dohvacanju filtriranih dogadaja:', error);
    //         }
    //     };

    //     getFilteredEvents();

    // }, [selectedLocationId, selectedSportId]);

    const handleSelectedLocationChanged = (event: SelectChangeEvent) => {
        setSelectedLocationId(event.target.value);
    };

    const handleFirstDropdownChange = (event: SelectChangeEvent) => {
        setFirstDropdown(event.target.value as string);
    };

    const handleCardClick = (id: string) => {
        router.push(`/event/${id}`);
    };

    return (
        <div>
            <Navbar />
            <HorizontalBar>
                <Link href="/create-event" passHref>
                    <StyledButton variant="contained">
                        Stvori novi događaj
                    </StyledButton>
                </Link>
                <Box sx={{ display: 'flex', gap: 2, marginRight: '10%', marginTop: 5 }}>
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
                    <StyledFormControl variant="outlined">
                        <InputLabel id="first-dropdown-label">Sport</InputLabel>
                        <Select
                            labelId="first-dropdown-label"
                            value={firstDropdown}
                            onChange={handleFirstDropdownChange}
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
                </Box>
            </HorizontalBar>
            <Box sx={{ padding: 2 }}>
                {sportEvents.length === 0 ? (
                    <Typography variant="h6" component="p">
                        Nema događaja za odabranu kategoriju
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {sportEvents.map((event) => (
                            <Grid item xs={12} sm={6} md={3} key={event.id}>
                                <Box onClick={() => handleCardClick(event.id)} sx={{ cursor: 'pointer' }}>
                                    <EventCard event={event} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </div>
    );
};

export default MyEvents;
