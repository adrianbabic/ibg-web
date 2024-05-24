import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import { AccountCircleOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

const NavbarContainer = styled(AppBar)({
    backgroundColor: '#90EE90',
    margin: 0,
    padding: 0,
    height: '70px',
    display: 'flex',
    justifyContent: 'center',
});

const StyledButton = styled(Button)(({ theme }) => ({
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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: 'grey',
}));

const Navbar: React.FC = () => {
    const router = useRouter();
    const currentPath = router.pathname;

    return (
        <NavbarContainer position="static">
            <Toolbar sx={{ justifyContent: 'space-between', height: '100%' }}>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Link href="/live-events" passHref>
                            <StyledButton className={currentPath === '/live-events' ? 'active' : ''}>
                                Aktivni događaji
                            </StyledButton>
                        </Link>
                        <Link href="/my-events" passHref>
                            <StyledButton className={currentPath === '/my-events' ? 'active' : ''}>
                                Moji događaji
                            </StyledButton>
                        </Link>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/my-profile" passHref>
                        <StyledButton className={currentPath === '/my-profile' ? 'active' : ''}>
                            <AccountCircleOutlined sx={{ color: grey[700], fontSize: '1.5rem' }} />
                        </StyledButton>
                    </Link>
                    <StyledIconButton>
                        <LogoutIcon sx={{ color: grey[700], fontSize: '1.5rem' }} />
                    </StyledIconButton>
                </Box>
            </Toolbar>
        </NavbarContainer>
    );
};

export default Navbar;
