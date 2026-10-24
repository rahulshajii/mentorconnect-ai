import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  WorkspacePremium as CertificateIcon,
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import * as certificateService from '../services/certificateService';

const CertificatesPage = () => {
  const { user } = useAuth();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      setLoading(true);
      try {
        const data = await certificateService.getMyCertificates();
        setCertificates(data || []);
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCerts();
    }
  }, [user]);

  const handleDownload = async (certId) => {
    try {
      await certificateService.downloadCertificatePdf(certId);
      toast.success('Certificate PDF download started');
    } catch (err) {
      toast.error('Could not download certificate');
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Verification link copied to clipboard!');
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            My Verified Certificates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Official cryptographically verifiable course completion credentials issued by MentorConnect AI.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={48} />
          </Box>
        ) : certificates.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <CertificateIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              No Certificates Earned Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Complete all lessons in an enrolled course and pass the final assessment to earn your official verified credential.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/my-courses"
              sx={{ py: 1.2, px: 3, borderRadius: 2 }}
            >
              Go to My Courses
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3.5}>
            {certificates.map((cert) => (
              <Grid item xs={12} md={6} key={cert._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1.5px solid #0a66c2',
                    boxShadow: '0 6px 18px rgba(10, 102, 194, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
                      color: '#ffffff',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <VerifiedIcon sx={{ color: '#38bdf8' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          VERIFIED CREDENTIAL
                        </Typography>
                      </Stack>
                      <Chip
                        label={cert.status.toUpperCase()}
                        size="small"
                        sx={{ bgcolor: '#10b981', color: '#ffffff', fontWeight: 800 }}
                      />
                    </Stack>
                  </Box>

                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                      {cert.courseTitle}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                      Instructor: {cert.instructorName || 'MentorConnect Faculty'} • Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                    </Typography>

                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mb: 3, bgcolor: '#f8fafc', borderRadius: 2 }}
                    >
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                        Certificate Identifier:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0a66c2' }}>
                        <code>{cert.certificateId}</code>
                      </Typography>
                    </Paper>

                    {/* Actions */}
                    <Box sx={{ mt: 'auto' }}>
                      <Divider sx={{ mb: 2 }} />
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(cert.certificateId)}
                          sx={{ borderRadius: 2 }}
                        >
                          Download PDF
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<LaunchIcon />}
                          component={Link}
                          to={`/verify-certificate/${cert.certificateId}`}
                          target="_blank"
                          sx={{ borderRadius: 2 }}
                        >
                          Verify Online
                        </Button>
                        <Tooltip title="Copy verification URL">
                          <IconButton
                            onClick={() =>
                              handleCopyLink(
                                cert.verificationUrl ||
                                  `${window.location.origin}/verify-certificate/${cert.certificateId}`
                              )
                            }
                            sx={{ border: '1px solid #cbd5e1', borderRadius: 2 }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default CertificatesPage;
