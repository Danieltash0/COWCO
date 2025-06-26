const QRCode = require('../models/QRCode');
const Cattle = require('../models/Cattle');

exports.generateQRCode = async (req, res) => {
  try {
    const { cattle_id } = req.body;
    
    // Check if cattle exists
    const cattle = await Cattle.getCattleById(cattle_id);
    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }
    
    // Check if QR code already exists for this cattle
    const existingQR = await QRCode.getQRCodeByCattleId(cattle_id);
    if (existingQR) {
      return res.json({ 
        qr_id: existingQR.qr_id, 
        qr_data: existingQR.qr_data,
        message: 'QR code already exists for this cattle' 
      });
    }
    
    // Generate QR data (cattle profile URL)
    const qrData = JSON.stringify({
      cattle_id: cattle_id,
      tag_number: cattle.tag_number,
      name: cattle.name,
      type: 'cattle_profile',
      url: `/cattle/${cattle_id}`
    });
    
    // Create QR code record
    const qrId = await QRCode.createQRCode({
      cattle_id: cattle_id,
      qr_data: qrData
    });
    
    res.status(201).json({ 
      qr_id: qrId, 
      qr_data: qrData,
      cattle: cattle 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.getAllQRCodes();
    res.json(qrCodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQRCodeById = async (req, res) => {
  try {
    const qrCode = await QRCode.getQRCodeById(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.json(qrCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQRCodeByCattleId = async (req, res) => {
  try {
    const qrCode = await QRCode.getQRCodeByCattleId(req.params.cattleId);
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found for this cattle' });
    }
    res.json(qrCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQRCode = async (req, res) => {
  try {
    await QRCode.deleteQRCode(req.params.id);
    res.json({ message: 'QR code deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.scanQRCode = async (req, res) => {
  try {
    const { qr_data } = req.body;
    
    if (!qr_data) {
      return res.status(400).json({ error: 'QR data is required' });
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(qr_data);
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid QR code data format' });
    }
    
    // Validate QR code data
    if (!parsedData.cattle_id || !parsedData.type || parsedData.type !== 'cattle_profile') {
      return res.status(400).json({ error: 'Invalid QR code data' });
    }
    
    // Get cattle information
    const cattle = await Cattle.getCattleById(parsedData.cattle_id);
    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }
    
    // Get QR code information
    const qrCode = await QRCode.getQRCodeByCattleId(parsedData.cattle_id);
    
    res.json({
      success: true,
      cattle: cattle,
      qr_code: qrCode,
      scanned_data: parsedData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 