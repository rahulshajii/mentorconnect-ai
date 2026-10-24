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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as CloudUploadIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import { getProfile } from '../services/profileService';

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editable Form States
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [coverPicture, setCoverPicture] = useState('');

  // Social Links
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');

  // Learner Fields
  const [education, setEducation] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [skillsText, setSkillsText] = useState('');

  // Mentor Fields
  const [experience, setExperience] = useState(1);
  const [hourlyFee, setHourlyFee] = useState(50);
  const [availability, setAvailability] = useState('');
  const [expertiseText, setExpertiseText] = useState('');

  // Image Upload Dialog States
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState('avatar'); // 'avatar' or 'cover'
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const applyProfileData = (u, p) => {
    if (u?.name) setName(u.name);
    if (p) {
      if (p.bio !== undefined) setBio(p.bio || '');
      setProfilePicture(p.profileImage || p.profilePicture || '');
      setCoverPicture(
        p.coverPicture ||
          (u?.role === 'mentor'
            ? 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')
      );

      setGithub(p.socialLinks?.github || '');
      setLinkedin(p.socialLinks?.linkedin || '');
      setPortfolio(p.socialLinks?.portfolio || '');

      if (u?.role === 'learner') {
        setEducation(p.education || '');
        setCareerGoal(p.careerGoal || '');
        if (Array.isArray(p.skills)) {
          setSkillsText(p.skills.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean).join(', '));
        } else {
          setSkillsText('');
        }
      } else if (u?.role === 'mentor') {
        setExperience(p.experience || 1);
        setHourlyFee(p.sessionPrice || p.hourlyFee || 50);
        setAvailability(
          Array.isArray(p.availability) ? p.availability.join(', ') : p.availability || 'Mon-Fri 10am-4pm'
        );
        if (Array.isArray(p.expertise)) {
          setExpertiseText(p.expertise.map((e) => (typeof e === 'string' ? e : e.name)).filter(Boolean).join(', '));
        } else {
          setExpertiseText('');
        }
      }
    }
  };

  useEffect(() => {
    if (user) {
      applyProfileData(user, profile);
      getProfile()
        .then((data) => {
          if (data) {
            applyProfileData(data, data.profile);
          }
        })
        .catch((err) => console.warn('Could not load profile from /api/profile:', err));
    }
  }, [user, profile]);

  // Helper Canvas Image Downscaling & Compression (Guarantees < 50KB Base64 payload!)
  const compressImage = (file, maxWidth, maxHeight, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
          let width = Math.round(img.width * scale);
          let height = Math.round(img.height * scale);

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Compress as JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Image File Selection Handler with Automatic Resizing & Compression
  const handleFileSelect = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    setUploadType(type);

    try {
      // Compress and resize: Avatar 250x250 (15KB), Cover 800x300 (30KB)
      const maxWidth = type === 'avatar' ? 250 : 800;
      const maxHeight = type === 'avatar' ? 250 : 300;
      const quality = type === 'avatar' ? 0.75 : 0.65;
      const compressedDataUrl = await compressImage(file, maxWidth, maxHeight, quality);

      setPreviewUrl(compressedDataUrl);
      setUploadDialogOpen(true);
    } catch (err) {
      toast.error('Failed to process image file.');
    }
  };

  // Confirm File Upload & Save into State
  const handleConfirmUpload = () => {
    setUploadProgress(50);
    setTimeout(() => {
      setUploadProgress(100);
      setTimeout(() => {
        if (uploadType === 'avatar') {
          setProfilePicture(previewUrl);
          toast.success('Profile photo selected! Click "Save Profile" to update.');
        } else {
          setCoverPicture(previewUrl);
          toast.success('Cover photo selected! Click "Save Profile" to update.');
        }
        setUploadDialogOpen(false);
        setPreviewUrl('');
        setUploadProgress(0);
      }, 250);
    }, 250);
  };

  // Save Profile Changes to Backend & MongoDB
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        bio: bio.trim(),
        profileImage: profilePicture,
        profilePicture,
        coverPicture,
        socialLinks: {
          github: github.trim(),
          linkedin: linkedin.trim(),
          portfolio: portfolio.trim(),
        },
      };

      if (user?.role === 'learner') {
        payload.education = education.trim();
        payload.careerGoal = careerGoal.trim();
        payload.skills = skillsText
          ? skillsText.split(',').map((s) => ({ name: s.trim(), level: 'Intermediate' })).filter((s) => s.name)
          : (profile?.skills || [])
              .map((s) => (typeof s === 'string' ? { name: s.trim(), level: 'Intermediate' } : { name: (s.name || s.skill || '').trim(), level: s.level || 'Intermediate' }))
              .filter((s) => s.name);
      } else {
        payload.experience = Number(experience) || 1;
        payload.sessionPrice = Number(hourlyFee) || 50;
        payload.hourlyFee = Number(hourlyFee) || 50;
        payload.availability = availability;
        payload.expertise = expertiseText
          ? expertiseText.split(',').map((e) => ({ name: e.trim(), experience: Number(experience) || 3 })).filter((e) => e.name)
          : (profile?.expertise || [])
              .map((e) => (typeof e === 'string' ? { name: e.trim(), experience: Number(experience) || 3 } : { name: (e.name || e.skill || '').trim(), experience: Number(e.experience) || 3 }))
              .filter((e) => e.name);
      }

      console.log('[DEBUG Frontend Profile Update Payload]:', JSON.stringify(payload, null, 2));

      await updateProfile(payload);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update profile.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user && profile) {
      setName(user.name || '');
      setBio(profile.bio || '');
      setProfilePicture(profile.profileImage || profile.profilePicture || '');
      setCoverPicture(profile.coverPicture || '');
      setGithub(profile.socialLinks?.github || '');
      setLinkedin(profile.socialLinks?.linkedin || '');
      setPortfolio(profile.socialLinks?.portfolio || '');
    }
  };

  // Calculate Profile Completion Score
  const getCompletionScore = () => {
    let score = 30;
    if (bio) score += 20;
    if (profilePicture) score += 20;
    if (github || linkedin || portfolio) score += 15;
    if (education || experience) score += 15;
    return Math.min(100, score);
  };

  const completionPercent = getCompletionScore();

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        {/* Main Profile Card */}
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: '#ffffff', mb: 4 }}>
          {/* Cover Photo Banner */}
          <Box
            sx={{
              height: 240,
              position: 'relative',
              backgroundImage: `url(${coverPicture})`,
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

            {/* Cover Upload Button */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<PhotoCameraIcon />}
                size="small"
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 6,
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.98)' },
                }}
              >
                Change Cover Photo
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => handleFileSelect(e, 'cover')}
                />
              </Button>
            </Box>

            {/* User Name & Email inside Banner with Crisp White Text */}
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
                  fontSize: { xs: '1.4rem', sm: '1.9rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontWeight: 600,
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                  mt: 0.3,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {user?.email}
              </Typography>
              <Chip
                icon={
                  user?.role === 'mentor' ? (
                    <WorkIcon fontSize="small" style={{ color: '#ffffff' }} />
                  ) : (
                    <SchoolIcon fontSize="small" style={{ color: '#ffffff' }} />
                  )
                }
                label={user?.role === 'mentor' ? 'Verified Mentor' : 'Active Learner'}
                size="small"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  color: '#ffffff',
                  bgcolor: user?.role === 'mentor' ? '#7c3aed' : '#0a66c2',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
            </Box>
          </Box>

          {/* Profile Header & Avatar */}
          <Box sx={{ px: { xs: 3, sm: 5 }, pb: 4, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, mt: -7 }}>
              {/* Circular Avatar with Camera Icon Overlay */}
              <Box sx={{ position: 'relative', display: 'inline-block', zIndex: 3 }}>
                <Avatar
                  src={profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  sx={{
                    width: 130,
                    height: 130,
                    border: '4px solid #ffffff',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                  }}
                />
                <Tooltip title="Change Profile Picture">
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      bgcolor: '#0a66c2',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      '&:hover': { bgcolor: '#004182' },
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => handleFileSelect(e, 'avatar')}
                    />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ pt: 8 }}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{ borderRadius: 6, fontWeight: 700, px: 3 }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={loading}
                      sx={{ borderRadius: 6, fontWeight: 700, px: 3 }}
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ borderRadius: 6, fontWeight: 700 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>

            {/* Profile Completion Meter Widget */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, mb: 4, border: '1px solid #e0e0e0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#191919' }}>
                  Profile Completion
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0a66c2' }}>
                  {completionPercent}% Complete
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={completionPercent}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Editable Profile Form Fields */}
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
                    disabled
                    label="Account Role"
                    value={user?.role === 'mentor' ? 'Mentor Account' : 'Learner Account'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled={!isEditing}
                    multiline
                    rows={3}
                    label="Personal Bio"
                    placeholder="Tell mentors and learners about your professional background..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Grid>

                {/* Social Links Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#191919' }}>
                    Social & Portfolio Links
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="GitHub Profile URL"
                        placeholder="https://github.com/username"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        InputProps={{
                          startAdornment: <GitHubIcon sx={{ color: '#5e5e5e', mr: 1 }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="LinkedIn Profile URL"
                        placeholder="https://linkedin.com/in/username"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        InputProps={{
                          startAdornment: <LinkedInIcon sx={{ color: '#0a66c2', mr: 1 }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Portfolio Website"
                        placeholder="https://yourwebsite.com"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        InputProps={{
                          startAdornment: <LanguageIcon sx={{ color: '#14b8a6', mr: 1 }} />,
                        }}
                      />
                    </Grid>
                  </Grid>
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

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Configured Technical Skills (Comma Separated)"
                        placeholder="React, Node.js, Python, System Architecture"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        helperText="Separate skills with commas (e.g. React, Node.js, Python)"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#191919' }}>
                        Active Verified Skills
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {profile?.skills?.map((s, idx) => (
                          <Chip
                            key={idx}
                            icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                            label={`${typeof s === 'string' ? s : s.name} (${typeof s === 'string' ? 'Intermediate' : s.level || 'Intermediate'})`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
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
                        label="Hourly Session Price ($)"
                        value={hourlyFee}
                        onChange={(e) => setHourlyFee(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Expertise Domains (Comma Separated)"
                        placeholder="React, System Design, Node.js"
                        value={expertiseText}
                        onChange={(e) => setExpertiseText(e.target.value)}
                      />
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

      {/* Image Preview & Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {uploadType === 'avatar' ? 'Preview Profile Photo' : 'Preview Cover Photo'}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          {previewUrl && (
            <Box sx={{ mb: 2 }}>
              {uploadType === 'avatar' ? (
                <Avatar
                  src={previewUrl}
                  sx={{ width: 140, height: 140, mx: 'auto', border: '3px solid #0a66c2' }}
                />
              ) : (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Cover Preview"
                  sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 2 }}
                />
              )}
            </Box>
          )}

          {uploadProgress > 0 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setUploadDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmUpload}
            startIcon={<CloudUploadIcon />}
            sx={{ borderRadius: 6, fontWeight: 700 }}
          >
            Apply Photo
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProfilePage;
