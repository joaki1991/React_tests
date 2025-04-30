import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Header = ({ userName, userImage, onLogout, onMessages, logoImage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        paddingY: 2,
      }}
    >
      <Toolbar sx={{ position: 'relative', flexDirection: isMobile ? 'column' : 'row', paddingX: 2 }}>
        
        {/* LOGO */}
        <Box
          sx={{
            position: isMobile ? 'static' : 'absolute',
            left: 0,
            right: 0,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            mb: isMobile ? 2 : 0,
            pointerEvents: 'none', // para que no interfiera con clicks
            zIndex: 0,
          }}
        >
          <img
            src={logoImage}
            alt="EducaCenter Logo"
            loading="lazy"
            style={{
              maxWidth: '150px',
              width: '100%',
              height: 'auto',
            }}
          />
        </Box>

        {/* CONTENEDOR PRINCIPAL (usuario + iconos) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            zIndex: 1,
            gap: isMobile ? 1.5 : 0,
          }}
        >
          {/* Usuario */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#bbdefb',
                borderRadius: 1,
              },
              px: 1,
              py: 0.5,
            }}
          >
            <Avatar src={userImage} alt={userName}>
              {userName?.[0]}
            </Avatar>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {userName}
            </Typography>
          </Box>

          {/* Iconos */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
            }}
          >
            <IconButton
              onClick={onMessages}
              sx={{
                color: '#0d47a1',
                '&:hover': {
                  backgroundColor: '#bbdefb',
                },
              }}
            >
              <MailIcon />
            </IconButton>
            <IconButton
              onClick={onLogout}
              sx={{
                color: '#0d47a1',
                '&:hover': {
                  backgroundColor: '#bbdefb',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;