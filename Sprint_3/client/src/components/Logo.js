import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'medium', colorMode = 'dark', iconOnly = false }) => {
  const iconSizes = {
    small: 28,
    medium: 36,
    large: 48,
  };

  const fontSizes = {
    small: '1.1rem',
    medium: '1.35rem',
    large: '1.75rem',
  };

  const currentSize = iconSizes[size] || 36;
  const currentFontSize = fontSizes[size] || '1.35rem';
  const textPrimaryColor = colorMode === 'light' ? '#ffffff' : '#191919';

  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {/* Modern Vector SVG Mark */}
      <svg
        width={currentSize}
        height={currentSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A66C2" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0A66C2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Rounded Hexagonal Base Container */}
        <rect width="40" height="40" rx="10" fill="url(#logoGrad)" filter="url(#glow)" />

        {/* Interlocking Mentoring Connection Nodes & Brain Spark */}
        <circle cx="14" cy="14" r="3.5" fill="#FFFFFF" />
        <circle cx="26" cy="14" r="3.5" fill="#FFFFFF" />
        <circle cx="20" cy="26" r="4" fill="#FFFFFF" />

        {/* Neural Network Connection Path */}
        <path
          d="M14 14 L26 14 L20 26 Z"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />

        {/* Center AI Spark Node */}
        <circle cx="20" cy="18" r="2" fill="#14B8A6" />
      </svg>

      {!iconOnly && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: currentFontSize,
            color: textPrimaryColor,
            letterSpacing: '-0.4px',
            lineHeight: 1,
          }}
        >
          MentorConnect{' '}
          <Typography
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: currentFontSize,
              color: '#0A66C2',
            }}
          >
            AI
          </Typography>
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
