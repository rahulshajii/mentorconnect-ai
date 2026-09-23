import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Topic as TopicIcon,
  EventAvailable as AvailableIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { bookSession, getMentorAvailability } from '../services/sessionService';

const BookingModal = ({ open, onClose, mentor, onBookingSuccess }) => {
  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTomorrowString());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch slots whenever date or mentor changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!mentor || !open || !date) return;
      setLoadingSlots(true);
      setErrorMsg('');
      try {
        const mentorId = mentor.userId?._id || mentor.userId || mentor._id;
        const res = await getMentorAvailability(mentorId, date);
        setSlots(res.slots || []);
        // Auto-select first available slot if current selection invalid
        const available = res.slots?.filter((s) => s.isAvailable);
        if (available && available.length > 0) {
          setSelectedSlot(available[0].startTime);
        } else {
          setSelectedSlot('');
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [mentor, date, open]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg('Please select an available time slot.');
      return;
    }
    if (!topic.trim()) {
      setErrorMsg('Please enter a session topic.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const mentorId = mentor.userId?._id || mentor.userId || mentor._id;
      const payload = {
        mentorId,
        date,
        startTime: selectedSlot,
        topic: topic.trim(),
        description: description.trim(),
      };

      const res = await bookSession(payload);
      toast.success(res.message || 'Session request sent successfully!');

      if (onBookingSuccess) {
        onBookingSuccess(res.session);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to book session.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mentor) return null;

  const mentorName = mentor.userId?.name || mentor.name || 'Verified Mentor';
  const mentorImage = mentor.profileImage || mentor.userId?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentorName}`;
  const sessionFee = mentor.sessionPrice || mentor.hourlyFee || 50;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ pb: 1, pt: 2, px: 3, fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CalendarIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Book Mentoring Session
          </Typography>
        </Stack>
        <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', p: 0.5, color: '#64748b' }}>
          <CloseIcon fontSize="small" />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1 }}>
        {/* Mentor Preview Card */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, mb: 3, border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={mentorImage} alt={mentorName} sx={{ width: 54, height: 54, border: '2px solid #0a66c2' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                {mentorName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                Hourly Session Fee: <strong>${sessionFee} / hr</strong>
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Step 1: Select Date */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            1. Select Session Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            inputProps={{ min: todayStr }}
            sx={{ mb: 3 }}
          />

          {/* Step 2: Select Time Slot */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            2. Available Time Slots ({date})
          </Typography>

          {loadingSlots ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {slots.map((slot, idx) => (
                  <Chip
                    key={idx}
                    icon={slot.startTime === selectedSlot ? <CheckIcon fontSize="small" /> : <TimeIcon fontSize="small" />}
                    label={slot.startTime}
                    disabled={!slot.isAvailable}
                    color={slot.startTime === selectedSlot ? 'primary' : 'default'}
                    variant={slot.startTime === selectedSlot ? 'filled' : 'outlined'}
                    onClick={() => slot.isAvailable && setSelectedSlot(slot.startTime)}
                    sx={{
                      fontWeight: 700,
                      cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                    }}
                  />
                ))}
              </Stack>
              {slots.filter((s) => s.isAvailable).length === 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  No available slots on this date. Please select another date.
                </Typography>
              )}
            </Box>
          )}

          {/* Step 3: Session Details */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            3. Mentoring Topic & Objectives
          </Typography>

          <TextField
            fullWidth
            required
            label="Session Topic"
            placeholder="e.g. System Design Mock Interview or React State Architecture"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Additional Notes / Questions (Optional)"
            placeholder="Describe what specific guidance or assistance you need during this session..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting || !selectedSlot || !topic.trim()}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <AvailableIcon />}
          sx={{ borderRadius: 6, fontWeight: 700, px: 3 }}
        >
          {submitting ? 'Booking...' : 'Confirm Session Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;
