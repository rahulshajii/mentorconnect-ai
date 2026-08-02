import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import DashboardLayout from '../layouts/DashboardLayout';
import * as recommendationService from '../services/recommendationService';

const RecommendedMentorsPage = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await recommendationService.getRecommendations();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <LinearProgress />
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesomeIcon sx={{ color: '#ffffff', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#191919' }}>
              AMIE Mentor Recommendations
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Adaptive Mentoring Inference Engine (AMIE v1.0) matches you with domain mentors based on skill compatibility, career goals, and quiz assessments.
          </Typography>
        </Paper>

        {/* Mentors Cards Grid */}
        <Grid container spacing={3}>
          {recommendations.map((mentor, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Top Row: Avatar & Match Score */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={mentor.profileImage}
                        alt={mentor.name}
                        sx={{ width: 64, height: 64, border: '2px solid #0a66c2' }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#191919' }}>
                          {mentor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mentor.experience} Years Experience • ${mentor.sessionPrice}/hr
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                          <StarIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#191919' }}>
                            {mentor.rating} Rating
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Match Score Badge */}
                    <Chip
                      icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#ffffff !important' }} />}
                      label={`${mentor.matchScore}% Match`}
                      sx={{
                        bgcolor: mentor.matchScore >= 80 ? '#057642' : '#0a66c2',
                        color: '#ffffff',
                        fontWeight: 800,
                        px: 0.5,
                      }}
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Explainable Match Reasons */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#191919', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <AutoAwesomeIcon color="primary" fontSize="small" /> Why AMIE Recommends This Mentor
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {mentor.reasons.map((reason, rIdx) => (
                      <Box key={rIdx} sx={{ p: 1, px: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, borderLeft: '3px solid #0a66c2', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#0a66c2', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#191919' }}>
                          {reason}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  {/* Expertise Chips */}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, mb: 1 }}>
                    Expertise Domains:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.8}>
                    {mentor.expertise.map((exp, eIdx) => (
                      <Chip
                        key={eIdx}
                        label={`${exp.name} (${exp.experience}y)`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                </CardContent>

                {/* Footer Action */}
                <Box sx={{ p: 2, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e0e0e0' }}>
                  <Button fullWidth variant="contained" color="primary" sx={{ borderRadius: 6, fontWeight: 700 }}>
                    Connect with Mentor
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default RecommendedMentorsPage;
