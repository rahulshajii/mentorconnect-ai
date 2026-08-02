import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

const steps = [
  'Basic Information',
  'Choose Role',
  'Professional Information',
  'Review',
  'Create Account',
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Choose Role
  const [role, setRole] = useState('learner');

  // Step 3: Professional Info (Learner)
  const [education, setEducation] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [skillsList, setSkillsList] = useState([
    { name: 'JavaScript', level: 'Intermediate' },
    { name: 'React', level: 'Intermediate' },
  ]);

  // Step 3: Professional Info (Mentor)
  const [experience, setExperience] = useState(3);
  const [sessionPrice, setSessionPrice] = useState(50);
  const [expertiseName, setExpertiseName] = useState('');
  const [expertiseYears, setExpertiseYears] = useState(3);
  const [expertiseList, setExpertiseList] = useState([
    { name: 'React', experience: 4 },
    { name: 'Node.js', experience: 3 },
  ]);
  const [availability, setAvailability] = useState('Mon-Fri: 10:00 AM - 04:00 PM');
  const [bio, setBio] = useState('');

  const handleAddSkill = () => {
    if (skillName.trim() && !skillsList.some((s) => s.name.toLowerCase() === skillName.trim().toLowerCase())) {
      setSkillsList([...skillsList, { name: skillName.trim(), level: skillLevel }]);
      setSkillName('');
    }
  };

  const handleRemoveSkill = (nameToRemove) => {
    setSkillsList(skillsList.filter((s) => s.name !== nameToRemove));
  };

  const handleAddExpertise = () => {
    if (expertiseName.trim() && !expertiseList.some((e) => e.name.toLowerCase() === expertiseName.trim().toLowerCase())) {
      setExpertiseList([...expertiseList, { name: expertiseName.trim(), experience: Number(expertiseYears) || 1 }]);
      setExpertiseName('');
    }
  };

  const handleRemoveExpertise = (nameToRemove) => {
    setExpertiseList(expertiseList.filter((e) => e.name !== nameToRemove));
  };

  const handleNext = () => {
    setError('');

    if (activeStep === 0) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all required basic information fields.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Password and Confirm Password do not match.');
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        email,
        password,
        confirmPassword,
        role,
        bio,
      };

      if (role === 'learner') {
        payload.education = education;
        payload.careerGoal = careerGoal;
        payload.skills = skillsList;
      } else {
        payload.experience = experience;
        payload.sessionPrice = sessionPrice;
        payload.expertise = expertiseList;
        payload.availability = availability;
      }

      const res = await register(payload);
      const redirectPath = res.role === 'mentor' ? '/mentor/dashboard' : '/learner/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: '#ffffff' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                bgcolor: '#0a66c2',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <AutoAwesomeIcon sx={{ color: '#ffffff', fontSize: 24 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#191919' }}>
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join the MentorConnect AI professional mentorship network
            </Typography>
          </Box>

          {/* Stepper Header (5 Steps) */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 2, color: '#991b1b' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{error}</Typography>
            </Box>
          )}

          {/* Animated Step Form Body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 1: Basic Information */}
              {activeStep === 0 && (
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      placeholder="e.g. Rahul Shaji"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>
              )}

              {/* STEP 2: Choose Role */}
              {activeStep === 1 && (
                <Box sx={{ py: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#191919' }}>
                    How do you plan to use MentorConnect AI?
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Card
                        onClick={() => setRole('learner')}
                        sx={{
                          p: 3,
                          cursor: 'pointer',
                          border: role === 'learner' ? '2px solid #0a66c2' : '1px solid #e0e0e0',
                          bgcolor: role === 'learner' ? 'rgba(10, 102, 194, 0.04)' : '#ffffff',
                          transition: 'all 0.2s',
                        }}
                      >
                        <CardContent sx={{ p: 0, textAlign: 'center' }}>
                          <Box sx={{ width: 54, height: 54, borderRadius: '50%', bgcolor: 'rgba(10, 102, 194, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <SchoolIcon sx={{ color: '#0a66c2', fontSize: 30 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#191919' }}>
                            Join as a Learner
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Find verified mentors, set career goals, and build structured technical skill sets.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card
                        onClick={() => setRole('mentor')}
                        sx={{
                          p: 3,
                          cursor: 'pointer',
                          border: role === 'mentor' ? '2px solid #057642' : '1px solid #e0e0e0',
                          bgcolor: role === 'mentor' ? 'rgba(5, 118, 66, 0.04)' : '#ffffff',
                          transition: 'all 0.2s',
                        }}
                      >
                        <CardContent sx={{ p: 0, textAlign: 'center' }}>
                          <Box sx={{ width: 54, height: 54, borderRadius: '50%', bgcolor: 'rgba(5, 118, 66, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <WorkIcon sx={{ color: '#057642', fontSize: 30 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#191919' }}>
                            Join as a Mentor
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Offer professional 1-on-1 guidance, configure session pricing, and manage availability slots.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* STEP 3: Professional Information */}
              {activeStep === 2 && (
                <Box>
                  {role === 'learner' ? (
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Education Background"
                          placeholder="e.g. B.Tech / MCA in Computer Science"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Target Career Goal"
                          placeholder="e.g. Senior Full-Stack Engineer"
                          value={careerGoal}
                          onChange={(e) => setCareerGoal(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#191919' }}>
                          Skills & Proficiency Levels
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <TextField
                            size="small"
                            placeholder="Skill name (e.g. React)..."
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            sx={{ flexGrow: 1 }}
                          />
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                              value={skillLevel}
                              onChange={(e) => setSkillLevel(e.target.value)}
                            >
                              <MenuItem value="Beginner">Beginner</MenuItem>
                              <MenuItem value="Intermediate">Intermediate</MenuItem>
                              <MenuItem value="Advanced">Advanced</MenuItem>
                              <MenuItem value="Expert">Expert</MenuItem>
                            </Select>
                          </FormControl>
                          <Button variant="outlined" onClick={handleAddSkill}>
                            Add
                          </Button>
                        </Stack>

                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {skillsList.map((s, idx) => (
                            <Chip
                              key={idx}
                              label={`${s.name} (${s.level})`}
                              onDelete={() => handleRemoveSkill(s.name)}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Short Bio"
                          placeholder="Tell us about yourself..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Years of Experience"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Session Price ($ / hr)"
                          value={sessionPrice}
                          onChange={(e) => setSessionPrice(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#191919' }}>
                          Expertise & Experience Years per Domain
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <TextField
                            size="small"
                            placeholder="Expertise (e.g. Python)..."
                            value={expertiseName}
                            onChange={(e) => setExpertiseName(e.target.value)}
                            sx={{ flexGrow: 1 }}
                          />
                          <TextField
                            size="small"
                            type="number"
                            placeholder="Years"
                            value={expertiseYears}
                            onChange={(e) => setExpertiseYears(e.target.value)}
                            sx={{ width: 100 }}
                          />
                          <Button variant="outlined" color="secondary" onClick={handleAddExpertise}>
                            Add
                          </Button>
                        </Stack>

                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {expertiseList.map((e, idx) => (
                            <Chip
                              key={idx}
                              label={`${e.name} (${e.experience} Yrs)`}
                              onDelete={() => handleRemoveExpertise(e.name)}
                              color="secondary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Weekly Availability Schedule"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Professional Bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}

              {/* STEP 4: Review */}
              {activeStep === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#191919' }}>
                    Review Account Credentials
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc', mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">FULL NAME</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">EMAIL ADDRESS</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{email}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">ACCOUNT ROLE</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, textTransform: 'capitalize', color: role === 'mentor' ? '#057642' : '#0a66c2' }}>
                          {role}
                        </Typography>
                      </Grid>
                      {role === 'learner' ? (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">CAREER GOAL</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>{careerGoal || 'Not specified'}</Typography>
                        </Grid>
                      ) : (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">SESSION PRICE</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>${sessionPrice} / hr</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Box>
              )}

              {/* STEP 5: Create Account */}
              {activeStep === 4 && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#057642', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#191919' }}>
                    Ready to Launch Your Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Click below to create your account and access your personalized dashboard.
                  </Typography>
                  <Button
                    variant="contained"
                    color={role === 'mentor' ? 'secondary' : 'primary'}
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={<CheckCircleIcon />}
                    sx={{ px: 5, py: 1.5, borderRadius: 6, fontSize: '1rem', fontWeight: 700 }}
                  >
                    {loading ? 'Creating Account...' : 'Confirm & Create Account'}
                  </Button>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          {activeStep < 4 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 4, py: 1, borderRadius: 6, fontWeight: 700 }}
              >
                {activeStep === 3 ? 'Proceed to Final Step' : 'Next Step'}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" color="primary" underline="hover" sx={{ fontWeight: 700 }}>
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default RegisterPage;
