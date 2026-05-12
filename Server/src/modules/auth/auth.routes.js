const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { validateLogin } = require('./auth.validations');
const { authenticate, checkConnected, authorize  } = require('./auth.middleware');

router.post('/login', validateLogin, authController.login);

// Route de test protégée
router.get('/profile', authenticate, checkConnected, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/logout', authenticate, authController.logout);

module.exports = router;