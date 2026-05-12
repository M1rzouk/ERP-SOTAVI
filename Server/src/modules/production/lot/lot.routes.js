const express = require('express');
const router = express.Router();
const lotController = require('./lot.controller');
const { validateCreateLot } = require('./lot.validations');
const { authenticate, authorize } = require('../../auth/auth.middleware');

// Toutes les routes nécessitent authentification
router.use(authenticate);

// Créer un lot (permission: créer la production)
router.post('/', authorize('creer_production'), validateCreateLot, lotController.createLot);

// Récupérer un lot par son ID
router.get('/:id', authorize('consulter_production'), lotController.getLotById);

// Lister les lots (permission: consulter la production)
router.get('/', authorize('consulter_production'), lotController.getLots);

module.exports = router;