import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  Stack,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import * as skillGapService from '../services/skillGapService';

const SkillGapPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gapData, setGapData] = useState(null);

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const data = await skillGapService.getSkillGap();
        setGapData(data);
      } catch (err) {
        console.error('Failed to load skill gap data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <LinearProgress />
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        {/* Header Card */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff', mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Chip icon={<TrendingUpIcon />} label="CAREER READINESS ANALYSIS" color="primary" size="small" sx={{ fontWeight: 700, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#191919' }}>
                Skill Gap Analysis for {gapData?.careerGoal}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Comparing your current skills against standard benchmark requirements for target career goals.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>
                {gapData?.readinessPercentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Overall Readiness
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={gapData?.readinessPercentage || 0}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Strong Skills */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderTop: '4px solid #057642' }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#191919' }}>
                    Strong Skills
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  High proficiency skills verified in your profile
                </Typography>
                <Stack spacing={1}>
                  {gapData?.strongSkills?.length > 0 ? (
                    gapData.strongSkills.map((s, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(5, 118, 66, 0.08)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.name}</Typography>
                        <Chip label={s.level} size="small" color="success" sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No strong skills logged yet.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Weak Skills / Needs Assessment */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderTop: '4px solid #eab308' }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <WarningIcon sx={{ color: '#eab308' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#191919' }}>
                    Needs Assessment
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Skills requiring proficiency validation
                </Typography>
                <Stack spacing={1}>
                  {gapData?.weakSkills?.length > 0 ? (
                    gapData.weakSkills.map((s, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(234, 179, 8, 0.08)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.name}</Typography>
                        <Button size="small" variant="outlined" color="warning" onClick={() => navigate('/quiz')} sx={{ fontSize: '0.65rem', py: 0.2 }}>
                          Test
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">All current skills assessed.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Missing Skills */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderTop: '4px solid #ef4444' }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <ErrorIcon color="error" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#191919' }}>
                    Missing Skills
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Benchmark skills needed for target goal
                </Typography>
                <Stack spacing={1}>
                  {gapData?.missingSkills?.length > 0 ? (
                    gapData.missingSkills.map((s, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(239, 68, 68, 0.08)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#991b1b' }}>{s.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.reason}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">Zero missing benchmark skills!</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PsychologyIcon />}
            onClick={() => navigate('/quiz')}
            sx={{ borderRadius: 6, fontWeight: 700 }}
          >
            Take Skill Quiz
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => navigate('/recommendations')}
            sx={{ borderRadius: 6, fontWeight: 700 }}
          >
            View AMIE Recommended Mentors
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default SkillGapPage;
