import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture || '');
  const [coverPicture, setCoverPicture] = useState(profile?.coverPicture || '');

  // Learner Fields
  const [education, setEducation] = useState(profile?.education || '');
  const [careerGoal, setCareerGoal] = useState(profile?.careerGoal || '');

  // Mentor Fields
  const [experience, setExperience] = useState(profile?.experience || 0);
  const [hourlyFee, setHourlyFee] = useState(profile?.hourlyFee || 0);
  const [availability, setAvailability] = useState(
    Array.isArray(profile?.availability) ? profile.availability.join(', ') : (profile?.availability || '')
  );

  useEffect(() => {
    if (user && profile) {
      setName(user.name || '');
      setBio(profile.bio || '');
      setProfilePicture(profile.profilePicture || '');
      setCoverPicture(profile.coverPicture || '');

      if (user.role === 'learner') {
        setEducation(profile.education || '');
        setCareerGoal(profile.careerGoal || '');
      } else {
        setExperience(profile.experience || 0);
        setHourlyFee(profile.hourlyFee || 0);
        setAvailability(
          Array.isArray(profile.availability) ? profile.availability.join(', ') : (profile.availability || '')
        );
      }
    }
  }, [user, profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        bio,
        profilePicture,
        coverPicture,
      };

      if (user.role === 'learner') {
        payload.education = education;
        payload.careerGoal = careerGoal;
      } else {
        payload.experience = experience;
        payload.hourlyFee = hourlyFee;
        payload.availability = availability;
      }

      await updateProfile(payload);
      setIsEditing(false);
    } catch (err) {
      // Toast notification in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user && profile) {
      setName(user.name || '');
      setBio(profile.bio || '');
      setProfilePicture(profile.profilePicture || '');
      setCoverPicture(profile.coverPicture || '');
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 0, bgcolor: '#ffffff', borderRadius: 3, overflow: 'hidden', mb: 4 }}>
          {/* Cover Photo Banner */}
          <Box
            sx={{
              height: 160,
              backgroundImage: `url(${coverPicture || (user?.role === 'mentor' ? 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80' : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <Box sx={{ p: 4, pt: 0, position: 'relative' }}>
            {/* Header & Avatar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, mt: -6 }}>
              <Stack direction="row" spacing={3} alignItems="flex-end">
                <Avatar
                  src={profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '4px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                />
                <Box sx={{ pb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#191919' }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Chip
                    icon={user?.role === 'mentor' ? <WorkIcon fontSize="small" /> : <SchoolIcon fontSize="small" />}
                    label={user?.role === 'mentor' ? 'Mentor Account' : 'Learner Account'}
                    size="small"
                    color={user?.role === 'mentor' ? 'secondary' : 'primary'}
                    sx={{ mt: 1, fontWeight: 700 }}
                  />
                </Box>
              </Stack>

              {!isEditing ? (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ borderRadius: 6 }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ borderRadius: 6 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ borderRadius: 6 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Profile Form */}
            <Box component="form" onSubmit={handleSave}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    disabled={!isEditing}
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    disabled={!isEditing}
                    label="Profile Photo URL"
                    placeholder="https://..."
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    label="Personal Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Grid>

                {/* Learner Specific Editable Fields */}
                {user?.role === 'learner' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Education Background"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Target Career Goal"
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                      />
                    </Grid>

                    {/* Display Skills with Level Badges */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#191919' }}>
                        Configured Technical Skills & Levels
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {profile?.skills?.map((s, idx) => (
                          <Chip
                            key={idx}
                            label={`${s.name} (${s.level})`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  </>
                )}

                {/* Mentor Specific Editable Fields */}
                {user?.role === 'mentor' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        type="number"
                        label="Experience (Years)"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        type="number"
                        label="Hourly Mentoring Fee ($)"
                        value={hourlyFee}
                        onChange={(e) => setHourlyFee(e.target.value)}
                      />
                    </Grid>

                    {/* Display Expertise with Experience Badges */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#191919' }}>
                        Areas of Expertise & Domain Experience
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {profile?.expertise?.map((e, idx) => (
                          <Chip
                            key={idx}
                            label={`${e.name} (${e.experience} Yrs)`}
                            color="secondary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Availability Schedule"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default ProfilePage;
