const Cattle = require('../models/Cattle');

exports.createCattle = async (req, res) => {
  try {
    const id = await Cattle.createCattle(req.body);
    res.status(201).json({ cattle_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCattle = async (req, res) => {
  try {
    const cattle = await Cattle.getAllCattle();
    res.json(cattle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCattleById = async (req, res) => {
  try {
    const cattle = await Cattle.getCattleById(req.params.id);
    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }
    res.json(cattle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCattle = async (req, res) => {
  try {
    await Cattle.updateCattle(req.params.id, req.body);
    res.json({ message: 'Cattle updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCattle = async (req, res) => {
  try {
    await Cattle.deleteCattle(req.params.id);
    res.json({ message: 'Cattle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
