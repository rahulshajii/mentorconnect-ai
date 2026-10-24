import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  Cancel as InvalidIcon,
  Download as DownloadIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import * as certificateService from '../services/certificateService';

const CertificateVerifyPage = () => {
  const { certificateId } = useParams();

  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchVerification = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const data = await certificateService.verifyCertificate(certificateId);
        setCertData(data);
      } catch (err) {
        console.error('Verification query failed:', err);
        setErrorMsg(
          err.response?.data?.message ||
            'The requested certificate ID could not be verified in the platform registry.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      fetchVerification();
    }
  }, [certificateId]);

  const handleDownload = async () => {
    try {
      await certificateService.downloadCertificatePdf(certificateId);
      toast.success('Certificate download started');
    } catch (err) {
      toast.error('Could not download certificate');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: '#f4f5f7', minHeight: '100vh', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
              <CircularProgress size={50} />
              <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                Verifying certificate in cryptographic registry...
              </Typography>
            </Box>
          ) : errorMsg ? (
            /* INVALID OR NOT FOUND */
            <Paper elevation={3} sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, textAlign: 'center' }}>
              <InvalidIcon sx={{ fontSize: 72, color: '#ef4444', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Certificate Not Verified
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                {errorMsg}
              </Typography>

              <Alert severity="error" sx={{ maxWidth: 500, mx: 'auto', mb: 4, textAlign: 'left', borderRadius: 2 }}>
                Certificate ID: <code>{certificateId}</code> does not match any active issued credentials on MentorConnect AI.
              </Alert>

              <Button variant="contained" component={Link} to="/" startIcon={<HomeIcon />}>
                Go to Homepage
              </Button>
            </Paper>
          ) : (
            /* VALID VERIFIED CERTIFICATE */
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '2px solid #057642',
                boxShadow: '0 12px 32px rgba(5, 118, 66, 0.12)',
              }}
            >
              {/* Top Banner */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #057642 0%, #024d2a 100%)',
                  color: '#ffffff',
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                }}
              >
                <VerifiedIcon sx={{ fontSize: 56, color: '#4ade80', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                  VERIFIED PLATFORM CREDENTIAL
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  This document confirms the authentic course completion and evaluation record on MentorConnect AI.
                </Typography>
              </Box>

              {/* Certificate Details */}
              <Box sx={{ p: { xs: 3, sm: 5 }, bgcolor: '#ffffff' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Awarded To
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
                      {certData.learnerName}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Certificate Identifier
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0a66c2', mt: 0.5 }}>
                      <code>{certData.certificateId}</code>
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Course Title
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mt: 0.5 }}>
                      {certData.courseTitle}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Course Instructor
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', mt: 0.5 }}>
                      {certData.instructorName || 'MentorConnect Faculty'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Issue Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                      {new Date(certData.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label="ACTIVE & VALID" color="success" size="small" sx={{ fontWeight: 800 }} />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Assessment Score
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#057642', mt: 0.5 }}>
                      {certData.score ? `${certData.score}% (Pass)` : 'Verified Pass'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Authorized Issuer
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      MentorConnect AI — Academic Accreditation & Evaluation Board
                    </Typography>
                  </Grid>
                </Grid>

                {/* Actions */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{ py: 1.2, px: 3, borderRadius: 2 }}
                  >
                    Download Official PDF Certificate
                  </Button>
                  <Button variant="outlined" component={Link} to="/courses" sx={{ py: 1.2, px: 3, borderRadius: 2 }}>
                    Explore All Courses
                  </Button>
                </Stack>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
};

export default CertificateVerifyPage;
