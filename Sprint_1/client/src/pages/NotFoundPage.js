import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const NotFoundPage = () => {
  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h1" color="primary" sx={{ fontWeight: 800, fontSize: '6rem' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The requested route does not exist in MentorConnect AI Sprint 1.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Back to Home
        </Button>
      </Container>
    </MainLayout>
  );
};

export default NotFoundPage;
