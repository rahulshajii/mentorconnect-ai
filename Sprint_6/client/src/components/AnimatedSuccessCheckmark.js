import React from 'react';
import { Box } from '@mui/material';

const AnimatedSuccessCheckmark = ({ size = 110 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        my: 2,
        '@keyframes scaleUp': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '60%': { transform: 'scale(1.15)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        '@keyframes drawCircle': {
          '0%': { strokeDashoffset: 300 },
          '100%': { strokeDashoffset: 0 },
        },
        '@keyframes drawCheck': {
          '0%': { strokeDashoffset: 100 },
          '100%': { strokeDashoffset: 0 },
        },
        '@keyframes pulseGlow': {
          '0%': { filter: 'drop-shadow(0 0 0 rgba(16, 185, 129, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.6))' },
          '100%': { filter: 'drop-shadow(0 0 0 rgba(16, 185, 129, 0.4))' },
        },
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          animation: 'scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, pulseGlow 2.5s infinite 0.7s',
        }}
      >
        {/* Soft Background Circle */}
        <circle cx="50" cy="50" r="46" fill="#ecfdf5" />

        {/* Outer Animated Green Stroke */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#10b981"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="300"
          strokeDashoffset="300"
          style={{
            animation: 'drawCircle 0.8s ease-in-out forwards',
          }}
        />

        {/* Inner Animated Checkmark Tick */}
        <path
          d="M30 52 L44 66 L70 36"
          fill="none"
          stroke="#10b981"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="100"
          strokeDashoffset="100"
          style={{
            animation: 'drawCheck 0.6s ease-in-out 0.45s forwards',
          }}
        />
      </svg>
    </Box>
  );
};

export default AnimatedSuccessCheckmark;
