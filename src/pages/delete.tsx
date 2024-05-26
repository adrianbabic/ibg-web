import { useRouter } from 'next/router';
import { Typography, Box } from '@mui/material';

const EventPage = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h2" component="h1">
                Event ID: {id}
            </Typography>
        </Box>
    );
};

export default EventPage;