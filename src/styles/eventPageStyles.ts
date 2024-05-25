import { styled } from '@mui/material/styles';
import { Box, Button, FormControl } from '@mui/material';

export const HorizontalBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    height: '110px',
    marginTop: 0,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#90EE90',
    color: 'black',
    '&:hover': {
        backgroundColor: '#76c776',
    },
    textTransform: 'none'
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 200,
    '& .MuiInputLabel-root': {
        color: 'black',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#90EE90',
        },
        '&:hover fieldset': {
            borderColor: '#76c776',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#90EE90',
        },
    },
    '& .MuiSelect-root': {
        backgroundColor: 'white',
    },
}));