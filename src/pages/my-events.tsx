import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Box, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Sport, SportEvent } from '@/utils/external';
import { fetchMyEvents, fetchSports } from '@/utils/api';
import EventCard from '@/components/EventCard';
import { HorizontalBar, StyledButton, StyledFormControl } from '@/styles/eventPageStyles';


const MyEvents: React.FC = () => {
    const [firstDropdown, setFirstDropdown] = useState('');
    const [sports, setSports] = useState<Sport[]>([]);
    const [sportEvents, setSportEvents] = useState<SportEvent[]>([]);

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
                console.error('Pogreska pri dohvacanju aktivnih dogadaja:', error);
            }
        };

        getSports();
        getEvents();
    }, []);

    const handleFirstDropdownChange = (event: SelectChangeEvent) => {
        setFirstDropdown(event.target.value as string);
    };

    return (
        <div>
            <Navbar />
            <HorizontalBar>
                <StyledButton variant="contained">
                    Stvori novi događaj
                </StyledButton>
                <Box sx={{ display: 'flex', gap: 2, marginRight: '10%' }}>
                    <StyledFormControl variant="outlined">
                        <InputLabel id="first-dropdown-label">Odaberi sport</InputLabel>
                        <Select
                            labelId="first-dropdown-label"
                            value={firstDropdown}
                            onChange={handleFirstDropdownChange}
                            label="Odaberi sport"
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
                                <EventCard event={event} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </div>
    );
};

export default MyEvents;
