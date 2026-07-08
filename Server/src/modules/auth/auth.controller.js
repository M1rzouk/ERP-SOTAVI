// modules/auth/auth.controller.js
const authService = require('./auth.service');

exports.login = async (req, res, next) => {
  try {
    const { matricule, password } = req.body;
    const { token, employee, roles } = await authService.login(matricule, password);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      employee: {
        id: employee.id,
        matricule: employee.matricule,
        full_name: employee.full_name,
        username: employee.username,
        email: employee.email,
        pdp: employee.pdp,
        permissions: employee.permissions || []   // ✅ AJOUT des permissions
      },
      roles: roles.map(r => r.name)
    });
  } catch (error) {
    console.error('❌ Erreur login:', error.message);
    res.status(401).json({
      success: false,
      message: error.message || 'Matricule ou mot de passe invalide'
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    await authService.logout(employeeId);
    res.json({ success: true, message: 'Déconnecté avec succès' });
  } catch (error) {
    console.error('❌ Erreur logout:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la déconnexion' });
  }
};