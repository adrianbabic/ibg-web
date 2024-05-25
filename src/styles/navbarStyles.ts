import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

export const NavbarContainer = styled(AppBar)({
    backgroundColor: '#90EE90',
    margin: 0,
    padding: 0,
    height: '70px',
    display: 'flex',
    justifyContent: 'center',
});

export const StyledButton = styled(Button)(({ theme }) => ({
    color: 'black',
    fontSize: '1.2rem',
    textTransform: 'none',
    '&.active': {
        backgroundColor: 'white',
        color: 'black',
    },
    '&:hover': {
        backgroundColor: '#C6F6C6',
    },
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: 'grey',
    '&:hover': {
        backgroundColor: '#C6F6C6',
    },
}));