import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import { grey } from '@mui/material/colors';
import Cookies from 'js-cookie';
import { NavbarContainer, StyledButton, StyledIconButton } from '@/styles/navbarStyles';

const Navbar: React.FC = () => {
    const router = useRouter();
    const currentPath = router.pathname;

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

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
                    {/* <Link href="/my-profile" passHref>
                        <StyledButton className={currentPath === '/my-profile' ? 'active' : ''}>
                            <AccountCircleOutlined sx={{ color: grey[700], fontSize: '1.5rem' }} />
                        </StyledButton>
                    </Link> */}
                    <StyledIconButton onClick={handleLogout}>
                        <LogoutIcon sx={{ color: grey[700], fontSize: '1.5rem' }} />
                    </StyledIconButton>
                </Box>
            </Toolbar>
        </NavbarContainer>
    );
};

export default Navbar;
