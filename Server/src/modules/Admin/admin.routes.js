// modules/Admin/admin.routes.js
const express = require('express');
const router = express.Router();

// Importer le contrôleur
const adminController = require('./admin.controller');

// Importer les middlewares d'authentification
const { authenticate, checkConnected, authorize } = require('./../auth/auth.middleware');

// Importer les validations
const { validateCreateUser } = require('./../auth/auth.validations');

// Toutes les routes admin nécessitent authentification + permission manage_users
router.use(authenticate, checkConnected, authorize('manage_users'));

// Routes
router.get('/roles', adminController.getRoles);
router.get('/users', adminController.getUsers);
router.post('/users', validateCreateUser, adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;