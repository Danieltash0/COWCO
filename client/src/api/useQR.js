import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useQR = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/qr', {
        headers: getAuthHeaders(),
      });
      setQRCodes(response);
    } catch (err) {
      setError('Failed to fetch QR codes');
      console.error('Error fetching QR codes:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (cattleId) => {
    try {
      setLoading(true);
      const response = await apiRequest('/qr/generate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cattle_id: cattleId }),
      });
      
      // Refresh QR codes list
      await fetchQRCodes();
      return { success: true, qr_data: response.qr_data, cattle: response.cattle };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getQRCodeByCattleId = async (cattleId) => {
    try {
      const response = await apiRequest(`/qr/cattle/${cattleId}`, {
        headers: getAuthHeaders(),
      });
      return { success: true, qr_code: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteQRCode = async (qrId) => {
    try {
      await apiRequest(`/qr/${qrId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // Refresh QR codes list
      await fetchQRCodes();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const scanQRCode = async (qrData) => {
    try {
      const response = await apiRequest('/qr/scan', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ qr_data: qrData }),
      });
      
      return { success: true, cattle: response.cattle, scanned_data: response.scanned_data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    qrCodes,
    loading,
    error,
    generateQRCode,
    getQRCodeByCattleId,
    deleteQRCode,
    scanQRCode,
    fetchQRCodes
  };
}; 