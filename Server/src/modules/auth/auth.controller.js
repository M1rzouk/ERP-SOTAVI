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
        email: employee.email,
      },
      roles: roles.map(r => r.name)
    });
  } catch (error) {
    // Message générique pour la sécurité
    res.status(401).json({
      success: false,
      message: 'Matricule ou mot de passe invalide'
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const employeeId = req.user.id; // fourni par le middleware authenticate
    await authService.logout(employeeId);
    res.json({ success: true, message: 'Déconnecté avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la déconnexion' });
  }
};