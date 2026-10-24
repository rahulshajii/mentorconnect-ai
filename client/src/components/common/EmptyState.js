import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * Reusable standardized EmptyState component
 * @param {React.ReactNode} icon - Optional custom icon
 * @param {string} title - Main headline for the empty state
 * @param {string} description - Explanatory helper text
 * @param {string} actionLabel - Optional button label
 * @param {Function} onAction - Optional button click callback
 */
const EmptyState = ({
  icon,
  title = 'No records found',
  description = 'There is currently no data to display here.',
  actionLabel,
  onAction,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        textAlign: 'center',
        borderRadius: 3,
        border: '1px dashed #d0d7de',
        bgcolor: '#fafbfc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        my: 3,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'rgba(10, 102, 194, 0.08)',
          color: '#0a66c2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {icon || <InfoOutlinedIcon sx={{ fontSize: 32 }} />}
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#191919',
          mb: 0.8,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#5e6d55',
          maxWidth: 460,
          mb: actionLabel ? 2.5 : 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
