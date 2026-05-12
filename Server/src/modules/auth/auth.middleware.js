const authService = require('./auth.service');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expiré' });
    }
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
}

async function checkConnected(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT is_connected FROM employee WHERE id = $1`,
      [req.user.id]
    );
    if (!result.rows[0]?.is_connected) {
      return res.status(401).json({ success: false, message: 'Session expirée, veuillez vous reconnecter' });
    }
    // Mettre à jour last_activity_at
    await pool.query(
      `UPDATE employee SET last_activity_at = NOW() WHERE id = $1`,
      [req.user.id]
    );
    next();
  } catch (err) {
    next(err);
  }
}

function authorize(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some(perm => userPermissions.includes(perm));
    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Permission refusée' });
    }
    next();
  };
}

module.exports = { authenticate, authorize, checkConnected };