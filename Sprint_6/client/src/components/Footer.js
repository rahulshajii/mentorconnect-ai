import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff', borderTop: '1px solid #e0e0e0', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0a66c2', mb: 1 }}>
              MentorConnect <Typography component="span" variant="h6" sx={{ color: 'rgba(0,0,0,0.9)', fontWeight: 800 }}>AI</Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              An Intelligent Mentoring Platform powered by Adaptive Mentoring Inference Engine (AMIE). Empowering professionals and learners worldwide.
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 1.5 }}>
              Platform
            </Typography>
            <Stack spacing={1}>
              <MuiLink component={Link} to="/courses" color="text.secondary" underline="hover" variant="body2">Explore Courses</MuiLink>
              <MuiLink component={Link} to="/recommendations" color="text.secondary" underline="hover" variant="body2">Find Mentors</MuiLink>
              <MuiLink component={Link} to="/quiz" color="text.secondary" underline="hover" variant="body2">Skill Assessment</MuiLink>
            </Stack>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 1.5 }}>
              Resources
            </Typography>
            <Stack spacing={1}>
              <MuiLink component={Link} to="/skill-gap" color="text.secondary" underline="hover" variant="body2">AMIE Skill Gap</MuiLink>
              <MuiLink component={Link} to="/courses" color="text.secondary" underline="hover" variant="body2">Learning Roadmaps</MuiLink>
              <MuiLink component={Link} to="/certificates" color="text.secondary" underline="hover" variant="body2">Certificates</MuiLink>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 1.5 }}>
              Platform Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Professional Mentorship Network & Intelligent Career Guidance.
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid #e0e0e0', mt: 4, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} MentorConnect AI Corporation. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
