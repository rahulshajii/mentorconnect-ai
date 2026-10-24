import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Rating,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Search as SearchIcon,
  CalendarMonth as BookIcon,
  Visibility as ViewProfileIcon,
  AutoAwesome as AiIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import BookingModal from '../components/BookingModal';
import { getRecommendations } from '../services/recommendationService';
import { getMentorsList } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';

const RecommendedMentorsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [minExp, setMinExp] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);

  // Booking Modal State
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const loadMentorsData = async () => {
      setLoading(true);
      setError('');
      try {
        let mentorList = [];
        if (user?.role === 'learner') {
          try {
            const recRes = await getRecommendations();
            mentorList = recRes.recommendations || [];
          } catch (recErr) {
            console.warn('AMIE recommendation lookup failed, using general list:', recErr);
          }
        }

        if (!mentorList || mentorList.length === 0) {
          const allMentors = await getMentorsList();
          mentorList = allMentors.map((m) => ({
            ...m,
            matchScore: 85,
            reasons: ['Verified senior industry mentor.'],
          }));
        }
        setMentors(mentorList);
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setError('Failed to load mentor discovery list.');
      } finally {
        setLoading(false);
      }
    };

    loadMentorsData();
  }, [user]);

  // Filter Logic
  const filteredMentors = mentors.filter((m) => {
    const name = m.name || m.userId?.name || '';
    const expertiseStr = Array.isArray(m.expertise)
      ? m.expertise.map((e) => (typeof e === 'string' ? e : e.name)).join(' ')
      : '';

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expertiseStr.toLowerCase().includes(searchQuery.toLowerCase());

    const ratingVal = m.rating || 5.0;
    const expVal = m.experience || 1;
    const priceVal = m.sessionPrice || m.hourlyFee || 50;

    const matchesRating = ratingVal >= Number(minRating);
    const matchesExp = expVal >= Number(minExp);
    const matchesPrice = priceVal <= Number(maxPrice);

    return matchesSearch && matchesRating && matchesExp && matchesPrice;
  });

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <AiIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Mentor Discovery & AMIE Recommendations
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Discover top-tier industry mentors matched specifically to your target career goal and skill gaps.
          </Typography>
        </Box>

        {/* Filter Controls Card */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Input */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by mentor name or skill (e.g. React, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Min Experience Filter */}
            <Grid item xs={12} sm={4} md={2.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Min Experience"
                value={minExp}
                onChange={(e) => setMinExp(e.target.value)}
              >
                <MenuItem value={0}>Any Experience</MenuItem>
                <MenuItem value={2}>2+ Years</MenuItem>
                <MenuItem value={4}>4+ Years</MenuItem>
                <MenuItem value={6}>6+ Years</MenuItem>
              </TextField>
            </Grid>

            {/* Min Rating Filter */}
            <Grid item xs={12} sm={4} md={2.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Min Rating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <MenuItem value={0}>Any Rating</MenuItem>
                <MenuItem value={4.0}>4.0+ Stars</MenuItem>
                <MenuItem value={4.5}>4.5+ Stars</MenuItem>
                <MenuItem value={4.8}>4.8+ Stars</MenuItem>
              </TextField>
            </Grid>

            {/* Max Session Price Filter */}
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Max Price ($/hr)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <MenuItem value={200}>All Prices</MenuItem>
                <MenuItem value={50}>Under $50/hr</MenuItem>
                <MenuItem value={80}>Under $80/hr</MenuItem>
                <MenuItem value={120}>Under $120/hr</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Mentors Grid */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        ) : filteredMentors.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
              No Mentors Found Matching Filters
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria or resetting filters.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredMentors.map((m) => {
              const mentorId = m.mentorId || m.mentorProfileId || (typeof m.userId === 'string' ? m.userId : m.userId?._id) || m._id || 'unknown';
              const name = m.name || m.userId?.name || 'Verified Mentor';
              const avatar = m.profileImage || m.userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
              const fee = m.sessionPrice || m.hourlyFee || 50;
              const exp = m.experience || 3;
              const rating = m.rating || 5.0;

              return (
                <Grid item xs={12} md={6} key={mentorId}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 4,
                      border: '1px solid #e2e8f0',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      transition: '0.2s',
                      '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderColor: '#0a66c2' },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Card Header: Avatar & Info */}
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                        <Avatar src={avatar} alt={name} sx={{ width: 68, height: 68, border: '3px solid #0a66c2' }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                              {name}
                            </Typography>
                            {m.matchScore && (
                              <Chip
                                icon={<AiIcon sx={{ fontSize: '14px !important' }} />}
                                label={`${m.matchScore}% Match`}
                                color="success"
                                size="small"
                                sx={{ fontWeight: 800 }}
                              />
                            )}
                          </Stack>

                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Senior Industry Mentor ({exp}+ yrs exp)
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Rating value={Number(rating)} precision={0.1} readOnly size="small" />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
                              {rating} / 5.0
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Expertise Chips */}
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                        SKILLS & EXPERTISE:
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 2 }}>
                        {m.expertise?.map((e, idx) => {
                          const skillName = typeof e === 'string' ? e : e.name;
                          return (
                            <Chip
                              key={idx}
                              icon={<CheckIcon sx={{ fontSize: '12px !important' }} />}
                              label={skillName}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontWeight: 700, borderRadius: 1.5 }}
                            />
                          );
                        })}
                      </Stack>

                      {/* Recommendation Reason */}
                      {m.reasons && m.reasons.length > 0 && (
                        <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', mb: 2 }}>
                          <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600, display: 'block' }}>
                            "{m.reasons[0]}"
                          </Typography>
                        </Paper>
                      )}

                      <Divider sx={{ my: 1.5 }} />

                      {/* Card Footer: Price & Actions */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          ${fee} <Typography component="span" variant="caption" color="text.secondary">/ hr</Typography>
                        </Typography>

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewProfileIcon />}
                            onClick={() => navigate(`/mentor/${mentorId}`)}
                            sx={{ borderRadius: 6, fontWeight: 700 }}
                          >
                            View Profile
                          </Button>

                          {user?.role === 'learner' && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<BookIcon />}
                              onClick={() => {
                                setSelectedMentorForBooking(m);
                                setBookingOpen(true);
                              }}
                              sx={{ borderRadius: 6, fontWeight: 700 }}
                            >
                              Book Session
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Booking Dialog Modal */}
        <BookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          mentor={selectedMentorForBooking}
          onBookingSuccess={() => {
            navigate('/sessions');
          }}
        />
      </Container>
    </DashboardLayout>
  );
};

export default RecommendedMentorsPage;
