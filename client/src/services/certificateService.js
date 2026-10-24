import API from './api';

export const getMyCertificates = async () => {
  const response = await API.get('/certificates/my');
  return response.data;
};

export const verifyCertificate = async (certificateId) => {
  const response = await API.get(`/certificates/verify/${certificateId}`);
  return response.data;
};

export const downloadCertificatePdf = (certificateId) => {
  const token = localStorage.getItem('token');
  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const url = `${apiBase}/certificates/${certificateId}/download`;

  // Fetch as blob with Authorization header to download securely
  return fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to download certificate PDF');
      return res.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `MentorConnect_Certificate_${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    });
};
