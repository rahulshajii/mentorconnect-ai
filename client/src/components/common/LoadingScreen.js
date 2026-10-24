import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Reusable standardized LoadingScreen component
 * @param {string} message - Optional loading message text
 * @param {boolean} fullPage - Whether the loading screen occupies the full viewport height
 */
const LoadingScreen = ({ message = 'Loading...', fullPage = true }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullPage ? '80vh' : 300,
        gap: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <CircularProgress
        size={44}
        thickness={4}
        sx={{
          color: '#0a66c2',
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: '#5e6d55',
          fontWeight: 500,
          letterSpacing: 0.2,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
