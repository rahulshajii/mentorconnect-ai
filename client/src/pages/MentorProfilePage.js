import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Work as WorkIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  EventAvailable as AvailableIcon,
  AutoAwesome as AiIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  CalendarMonth as BookIcon,
} from '@mui/icons-material';
import DashboardLayout from '../layouts/DashboardLayout';
import BookingModal from '../components/BookingModal';
import { getMentorsList, getMentorById } from '../services/profileService';
import { getRecommendations } from '../services/recommendationService';
import { useAuth } from '../hooks/useAuth';

const MentorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [amieMatch, setAmieMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!id || id === 'undefined') {
        setError('Invalid mentor ID specified.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        let found = null;

        // 1. Try direct API getMentorById
        try {
          found = await getMentorById(id);
        } catch (apiErr) {
          console.warn('Direct getMentorById API failed, attempting list fallback:', apiErr);
        }

        // 2. Fallback to searching getMentorsList if direct lookup returned nothing
        if (!found) {
          const mentors = await getMentorsList();
          found = mentors.find((m) => {
            const mProfId = (m._id || m.mentorProfileId)?.toString();
            const mUserId = (m.userId?._id || m.userId || m.mentorId)?.toString();
            return mProfId === id.toString() || mUserId === id.toString();
          });
        }

        if (!found) {
          setError('Mentor profile not found.');
          setLoading(false);
          return;
        }

        setMentor(found);

        // Fetch AMIE recommendations to see if this mentor has a match score for learner
        if (user?.role === 'learner') {
          try {
            const recRes = await getRecommendations();
            const matchRec = recRes.recommendations?.find((r) => {
              const rUserId = (r.userId || r.mentorId || r._id)?.toString();
              const rProfId = r.mentorProfileId?.toString();
              return rUserId === id.toString() || rProfId === id.toString();
            });
            if (matchRec) {
              setAmieMatch(matchRec);
            }
          } catch (recErr) {
            console.warn('Could not fetch AMIE score:', recErr);
          }
        }
      } catch (err) {
        console.error('Error fetching mentor profile:', err);
        setError('Failed to load mentor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [id, user]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !mentor) {
    return (
      <DashboardLayout>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            Back to Discovery
          </Button>
          <Alert severity="error">{error || 'Mentor not found'}</Alert>
        </Container>
      </DashboardLayout>
    );
  }

  const mentorName = mentor.userId?.name || mentor.name || 'Verified Mentor';
  const mentorEmail = mentor.userId?.email || mentor.email || '';
  const mentorImage = mentor.profileImage || mentor.userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentorName}`;
  const coverImage = mentor.coverPicture || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80';
  const fee = mentor.sessionPrice || mentor.hourlyFee || 50;
  const rating = mentor.rating || 5.0;
  const experienceYears = mentor.experience || 3;

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2, fontWeight: 700 }}>
          Back to Mentors
        </Button>

        {/* Hero Card with Banner */}
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: '#ffffff', mb: 4 }}>
          {/* Cover Photo Banner */}
          <Box
            sx={{
              height: 240,
              position: 'relative',
              backgroundImage: `url(${coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.92) 100%)',
              }}
            />

            {/* User Name & Title inside Banner */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: { xs: 165, sm: 190 },
                right: 20,
                zIndex: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#ffffff',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  fontSize: { xs: '1.4rem', sm: '2rem' },
                }}
              >
                {mentorName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontWeight: 600,
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                  mt: 0.3,
                }}
              >
                Senior Industry Mentor ({experienceYears}+ Years Exp.)
              </Typography>
              {mentorEmail && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block', mt: 0.2 }}
                >
                  {mentorEmail}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Profile Header Bar */}
          <Box sx={{ px: { xs: 3, sm: 5 }, pb: 4, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, mt: -7 }}>
              <Avatar
                src={mentorImage}
                alt={mentorName}
                sx={{
                  width: 130,
                  height: 130,
                  border: '4px solid #ffffff',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                  zIndex: 3,
                }}
              />

              {user?.role === 'learner' && (
                <Box sx={{ pt: 8 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<BookIcon />}
                    onClick={() => setBookingOpen(true)}
                    sx={{ borderRadius: 6, fontWeight: 700, px: 4, py: 1.2, boxShadow: '0 4px 14px rgba(10, 102, 194, 0.4)' }}
                  >
                    Book Session (${fee}/hr)
                  </Button>
                </Box>
              )}
            </Box>

            {/* Quick Metrics Bar */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={3}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <StarIcon sx={{ color: '#faaf00' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      {rating} / 5.0
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Mentor Rating
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <WorkIcon sx={{ color: '#0a66c2' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      {experienceYears} Years
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Industry Experience
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <MoneyIcon sx={{ color: '#16a34a' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      ${fee} / hr
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Session Price
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <AvailableIcon sx={{ color: '#7c3aed' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      Available
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Mon - Fri Slots
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* AMIE Match Card (if available) */}
            {amieMatch && (
              <Card sx={{ mb: 4, borderRadius: 3, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <AiIcon sx={{ color: '#16a34a' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#166534' }}>
                      AMIE Adaptive Recommendation Match: {amieMatch.matchScore || 90}%
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>
                    "{amieMatch.reasons?.[0] || 'Strong domain alignment for your learning career goal.'}"
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Divider sx={{ mb: 4 }} />

            {/* Bio & Professional Summary */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
              About the Mentor
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              {mentor.bio || 'Dedicated senior professional committed to guiding learners through hands-on technical mentoring, system design reviews, and career advancement.'}
            </Typography>

            {/* Technical Expertise Domains */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a' }}>
              Expertise & Specialized Skills
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 4 }}>
              {mentor.expertise?.map((exp, idx) => {
                const expName = typeof exp === 'string' ? exp : exp.name;
                const expYears = typeof exp === 'object' ? exp.experience : null;
                return (
                  <Chip
                    key={idx}
                    icon={<CheckIcon sx={{ fontSize: '16px !important' }} />}
                    label={expYears ? `${expName} (${expYears} yrs)` : expName}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: 2, px: 1, py: 2 }}
                  />
                );
              })}
            </Stack>

            {/* Availability Schedule */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
              Configured Weekly Availability
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', display: 'inline-block' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                {Array.isArray(mentor.availability) ? mentor.availability.join(', ') : mentor.availability || 'Mon-Fri: 10:00 AM - 04:00 PM'}
              </Typography>
            </Paper>
          </Box>
        </Paper>

        {/* Booking Dialog Modal */}
        <BookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          mentor={mentor}
          onBookingSuccess={() => {
            navigate('/learner/dashboard');
          }}
        />
      </Container>
    </DashboardLayout>
  );
};

export default MentorProfilePage;
