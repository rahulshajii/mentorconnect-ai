import API from './api';

export const getMyCertificates = async () => {
  const response = await API.get('/certificates/my');
  return response.data;
};

export const verifyCertificate = async (certificateId) => {
  const response = await API.get(`/certificates/verify/${certificateId}`);
  return response.data;
};

export const downloadCertificatePdf = async (certificateId) => {
  const response = await API.get(`/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', `MentorConnect_Certificate_${certificateId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
  return response.data;
};
