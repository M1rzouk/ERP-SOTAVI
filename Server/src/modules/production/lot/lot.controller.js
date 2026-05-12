const lotService = require('./lot.service');

exports.createLot = async (req, res, next) => {
  try {
    const newLot = await lotService.createLot(req.body);
    // Nettoyer le code : garder seulement jusqu'au 'P' ou 'C'
    let displayCode = newLot.code;
    const match = displayCode.match(/^(LOT-\d{2}-\d{2}-\d{4}[PC])/);
    if (match) {
      displayCode = match[1];
    }
    // Envoyer la réponse avec le code simplifié
    res.status(201).json({
      success: true,
      data: {
        ...newLot,
        code: displayCode   // ← on écrase le champ code par la version courte
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getLots = async (req, res, next) => {
  try {
    const filters = {
      center_id: req.query.center_id,
      status_id: req.query.status_id
    };
    const lots = await lotService.getLots(filters);
    res.json({ success: true, data: lots });
  } catch (err) {
    next(err);
  }
};

exports.getLotById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lot = await lotService.getLotById(id);
    if (!lot) {
      return res.status(404).json({ success: false, message: 'Lot non trouvé' });
    }
    res.json({ success: true, data: lot });
  } catch (err) {
    next(err);
  }
};


