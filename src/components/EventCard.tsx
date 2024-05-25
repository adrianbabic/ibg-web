import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    width: '350px',
    height: '200px',
    backgroundColor: theme.palette.grey[200],
}));

interface EventCardProps {
    event: {
        id: string;
        name: string;
        maxPeople: number;
        currentPeople: number;
        location: {
            name: string;
        };
        startTime: string;
        sport: {
            name: string;
        };
    };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { name, maxPeople, currentPeople, location, startTime, sport } = event;
    return (
        <StyledCard>
            <CardContent>
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <Typography color="text.secondary">
                    Sport: {sport.name}
                </Typography>
                <Typography color="text.secondary">
                    Lokacija: {location.name}
                </Typography>
                <Typography color="text.secondary">
                    Vrijeme: {new Date(startTime).toLocaleString()}
                </Typography>
                <Typography color="text.secondary">
                    Igrača: {currentPeople}/{maxPeople}
                </Typography>
            </CardContent>
        </StyledCard>
    );
};

export default EventCard;
