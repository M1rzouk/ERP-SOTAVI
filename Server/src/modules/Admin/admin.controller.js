// modules/Admin/admin.controller.js
const adminService = require('./admin.service');

// Vérification que le service est chargé
console.log('✅ adminService chargé:', !!adminService);

/**
 * Récupère tous les rôles disponibles
 */
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await adminService.getRoles();
    res.json({
      success: true,
      roles: roles
    });
  } catch (error) {
    console.error('❌ Erreur getRoles:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des rôles'
    });
  }
};

/**
 * Crée un nouvel utilisateur
 */
exports.createUser = async (req, res, next) => {
  try {
    console.log('📝 Création d\'utilisateur - Données reçues:', req.body);
    const newUser = await adminService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      employee: newUser
    });
  } catch (error) {
    console.error('❌ Erreur createUser:', error);
    
    if (error.message.includes('existe déjà')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de l\'utilisateur'
    });
  }
};

/**
 * Récupère la liste des utilisateurs
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getUsers();
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('❌ Erreur getUsers:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des utilisateurs'
    });
  }
};

/**
 * Met à jour un utilisateur
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await adminService.updateUser(id, userData);
    
    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      employee: updatedUser
    });
  } catch (error) {
    console.error('❌ Erreur updateUser:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de l\'utilisateur'
    });
  }
};

/**
 * Supprime un utilisateur (désactivation)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteUser(id);
    
    res.json({
      success: true,
      message: 'Utilisateur désactivé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de l\'utilisateur'
    });
  }
};