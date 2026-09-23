import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  MenuItem,
  Select,
} from '@mui/material';
import {
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import * as quizService from '../services/quizService';

const QuizPage = () => {
  const navigate = useNavigate();

  const [selectedSkill, setSelectedSkill] = useState('React');
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [activeQ, setActiveQ] = useState(0);
  const [result, setResult] = useState(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const data = await quizService.startQuiz(selectedSkill);
      setQuestions(data.questions);
      setQuizStarted(true);
      setResult(null);
      setUserAnswers({});
      setActiveQ(0);
      toast.success(`Skill assessment started for ${data.skill}`);
    } catch (err) {
      toast.error('Failed to start quiz assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleSelect = (questionId, option) => {
    setUserAnswers({ ...userAnswers, [questionId]: [option] });
  };

  const handleMultiSelect = (questionId, option, checked) => {
    const current = userAnswers[questionId] || [];
    if (checked) {
      setUserAnswers({ ...userAnswers, [questionId]: [...current, option] });
    } else {
      setUserAnswers({ ...userAnswers, [questionId]: current.filter((o) => o !== option) });
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      const data = await quizService.submitQuiz(selectedSkill, userAnswers);
      setResult(data.result);
      setQuizStarted(false);
      toast.success(`Assessment completed! Score: ${data.result.percentage}%`);
    } catch (err) {
      toast.error('Failed to submit quiz assessment');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[activeQ];
  const progressPercent = questions.length ? Math.round(((activeQ + 1) / questions.length) * 100) : 0;

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        {!quizStarted && !result && (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff', textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(10, 102, 194, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <PsychologyIcon sx={{ color: '#0a66c2', fontSize: 36 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#191919' }}>
              Technical Skill Assessment
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Test your technical knowledge across core domains. Your assessed proficiency level will automatically update your profile and match score with domain mentors.
            </Typography>

            <FormControl sx={{ minWidth: 260, mb: 4 }}>
              <FormLabel sx={{ fontWeight: 700, mb: 1, color: '#191919', textAlign: 'left' }}>Select Skill Domain</FormLabel>
              <Select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
                <MenuItem value="React">React.js</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="System Architecture">System Architecture</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleStartQuiz}
                disabled={loading}
                startIcon={<AutoAwesomeIcon />}
                sx={{ px: 4, py: 1.2, borderRadius: 6, fontWeight: 700 }}
              >
                {loading ? 'Loading Assessment...' : 'Start Skill Assessment'}
              </Button>
            </Box>
          </Paper>
        )}

        {/* Active Quiz View */}
        {quizStarted && currentQuestion && (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Chip label={`Question ${activeQ + 1} of ${questions.length}`} color="primary" sx={{ fontWeight: 700 }} />
              <Stack direction="row" spacing={1} alignItems="center">
                <TimerIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>3:00 Remaining</Typography>
              </Stack>
            </Box>

            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4, mb: 4 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#191919' }}>
              {currentQuestion.question}
            </Typography>

            {currentQuestion.type === 'single' ? (
              <RadioGroup
                value={userAnswers[currentQuestion.id]?.[0] || ''}
                onChange={(e) => handleSingleSelect(currentQuestion.id, e.target.value)}
              >
                {currentQuestion.options.map((option, idx) => (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      px: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: userAnswers[currentQuestion.id]?.[0] === option ? 'rgba(10, 102, 194, 0.08)' : '#ffffff',
                      borderColor: userAnswers[currentQuestion.id]?.[0] === option ? '#0a66c2' : '#e0e0e0',
                    }}
                  >
                    <FormControlLabel value={option} control={<Radio />} label={option} />
                  </Paper>
                ))}
              </RadioGroup>
            ) : (
              <FormGroup>
                {currentQuestion.options.map((option, idx) => {
                  const checked = userAnswers[currentQuestion.id]?.includes(option) || false;
                  return (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        px: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        bgcolor: checked ? 'rgba(10, 102, 194, 0.08)' : '#ffffff',
                        borderColor: checked ? '#0a66c2' : '#e0e0e0',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={(e) => handleMultiSelect(currentQuestion.id, option, e.target.checked)}
                          />
                        }
                        label={option}
                      />
                    </Paper>
                  );
                })}
              </FormGroup>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={activeQ === 0} onClick={() => setActiveQ(activeQ - 1)}>
                Previous
              </Button>

              {activeQ < questions.length - 1 ? (
                <Button variant="contained" onClick={() => setActiveQ(activeQ + 1)}>
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmitQuiz}
                  disabled={loading}
                  startIcon={<CheckCircleIcon />}
                >
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              )}
            </Box>
          </Paper>
        )}

        {/* Assessment Result Summary View */}
        {result && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Chip
                label={`Assessed Level: ${result.levelAssessed}`}
                color={result.percentage >= 70 ? 'success' : 'warning'}
                sx={{ fontWeight: 800, mb: 1, fontSize: '0.9rem' }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#191919' }}>
                {result.percentage}% Score
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You answered {result.score} out of {result.totalQuestions} questions correctly for {result.skill}.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Detailed Question Analysis
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
              {result.answers.map((ans, idx) => (
                <Card key={idx} variant="outlined" sx={{ borderColor: ans.isCorrect ? '#86efac' : '#fca5a5', bgcolor: ans.isCorrect ? 'rgba(34, 197, 94, 0.04)' : 'rgba(239, 68, 68, 0.04)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      {ans.isCorrect ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {ans.question}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Your answer: {ans.selectedAnswer.join(', ') || 'No answer'}
                    </Typography>
                    {!ans.isCorrect && (
                      <Typography variant="caption" color="success.main" display="block" sx={{ fontWeight: 600 }}>
                        Correct answer: {ans.correctAnswer.join(', ')}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => setResult(null)}>
                Take Another Assessment
              </Button>
              <Button variant="contained" color="primary" onClick={() => navigate('/recommendations')}>
                View AMIE Recommended Mentors
              </Button>
            </Stack>
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default QuizPage;
