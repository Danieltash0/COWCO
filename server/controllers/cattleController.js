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
