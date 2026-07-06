const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
require('dotenv').config();

// Clé secrète pour JWT – à stocker dans .env !
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Vérification que la clé secrète est définie
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET non défini dans .env, utilisation d\'une clé par défaut (non sécurisé pour la production)');
}

class AuthService {
  /**
   * Authentifie un employé par son matricule et mot de passe.
   * @param {string} matricule - Matricule unique de l'employé.
   * @param {string} password - Mot de passe en clair.
   * @returns {Promise<{token: string, employee: object, roles: array}>}
   * @throws {Error} Si identifiants invalides ou compte inactif.
   */
  async login(matricule, password) {
    // Validation des entrées
    if (!matricule || !password) {
      throw new Error('Matricule et mot de passe sont requis');
    }

    try {
      // 1. Rechercher l'employé par matricule
      const result = await pool.query(
        `SELECT id, matricule, username, email, password_hash, full_name, is_active, is_connected
         FROM employee 
         WHERE matricule = $1`,
        [matricule.trim()]
      );

      if (result.rows.length === 0) {
        throw new Error('Matricule non trouvé');
      }

      const employee = result.rows[0];

      // 2. Vérifier si le compte est actif
      if (!employee.is_active) {
        throw new Error('Compte désactivé. Contactez l\'administrateur.');
      }

      // 3. Vérifier si l'utilisateur est déjà connecté (optionnel)
      if (employee.is_connected) {
        console.warn(`⚠️  Tentative de connexion pour un utilisateur déjà connecté: ${employee.matricule}`);
        // Vous pouvez soit autoriser la connexion, soit la refuser
        // Dans cet exemple, on autorise et on met à jour
      }

      // 4. Comparer le mot de passe fourni avec le hash stocké
      const isMatch = await bcrypt.compare(password, employee.password_hash);
      if (!isMatch) {
        throw new Error('Mot de passe incorrect');
      }

      // 5. Récupérer les rôles et permissions
      const rolesResult = await pool.query(
        `SELECT r.id, r.name, 
          COALESCE(
            (SELECT json_agg(p.name) 
             FROM role_permission rp 
             JOIN permission p ON rp.permission_id = p.id 
             WHERE rp.role_id = r.id), 
            '[]'::json
          ) as permissions
         FROM employee_role er
         JOIN role r ON er.role_id = r.id
         WHERE er.employee_id = $1`,
        [employee.id]
      );

      const roles = rolesResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        permissions: row.permissions || []
      }));

      // 6. Mettre à jour les informations de connexion
      await pool.query(
        `UPDATE employee 
         SET last_login_at = NOW(), 
             is_connected = TRUE, 
             last_activity_at = NOW() 
         WHERE id = $1`,
        [employee.id]
      );

      // 7. Générer un token JWT
      const token = this.generateToken(employee, roles);

      // 8. Préparer les données de l'employé à retourner (sans le hash)
      const employeeData = {
        id: employee.id,
        matricule: employee.matricule,
        username: employee.username,
        email: employee.email,
        full_name: employee.full_name,
        is_active: employee.is_active,
        permissions: [...new Set(roles.flatMap(r => r.permissions))]
      };

      return { 
        token, 
        employee: employeeData, 
        roles: roles.map(r => ({ id: r.id, name: r.name }))
      };

    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error.message);
      throw error;
    }
  }

  /**
   * Déconnecte un employé.
   * @param {number} employeeId - ID de l'employé.
   * @returns {Promise<boolean>}
   */
  async logout(employeeId) {
    try {
      await pool.query(
        `UPDATE employee SET is_connected = FALSE WHERE id = $1`,
        [employeeId]
      );
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error.message);
      throw error;
    }
  }

  /**
   * Génère un token JWT pour un employé.
   * @param {object} employee - Objet employé (avec id, matricule, etc.)
   * @param {array} roles - Liste des rôles avec permissions.
   * @returns {string} Token JWT
   */
  generateToken(employee, roles) {
    const permissions = [...new Set(roles.flatMap(r => r.permissions))];
    
    const payload = {
      id: employee.id,
      matricule: employee.matricule,
      fullName: employee.full_name,
      email: employee.email,
      roles: roles.map(r => r.name),
      permissions: permissions
    };

    try {
      return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN 
      });
    } catch (error) {
      console.error('❌ Erreur lors de la génération du token:', error.message);
      throw new Error('Erreur lors de la génération du token');
    }
  }

  /**
   * Vérifie la validité d'un token JWT.
   * @param {string} token - Token à vérifier.
   * @returns {object} Payload décodé.
   * @throws {Error} Si token invalide ou expiré.
   */
  verifyToken(token) {
    if (!token) {
      throw new Error('Token manquant');
    }

    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.warn('⚠️ Token expiré');
        throw new Error('Token expiré');
      }
      if (error.name === 'JsonWebTokenError') {
        console.warn('⚠️ Token invalide');
        throw new Error('Token invalide');
      }
      console.error('❌ Erreur lors de la vérification du token:', error.message);
      throw error;
    }
  }

  /**
   * Rafraîchit le token JWT.
   * @param {string} token - Token actuel.
   * @returns {string} Nouveau token.
   */
  async refreshToken(token) {
    try {
      const decoded = this.verifyToken(token);
      
      // Vérifier que l'utilisateur existe toujours
      const result = await pool.query(
        'SELECT id, is_active FROM employee WHERE id = $1',
        [decoded.id]
      );
      
      if (result.rows.length === 0 || !result.rows[0].is_active) {
        throw new Error('Utilisateur non trouvé ou inactif');
      }

      // Récupérer les rôles et permissions à jour
      const rolesResult = await pool.query(
        `SELECT r.id, r.name, 
          COALESCE(
            (SELECT json_agg(p.name) 
             FROM role_permission rp 
             JOIN permission p ON rp.permission_id = p.id 
             WHERE rp.role_id = r.id), 
            '[]'::json
          ) as permissions
         FROM employee_role er
         JOIN role r ON er.role_id = r.id
         WHERE er.employee_id = $1`,
        [decoded.id]
      );

      const roles = rolesResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        permissions: row.permissions || []
      }));

      // Récupérer les infos de l'employé
      const employeeResult = await pool.query(
        'SELECT id, matricule, full_name, email FROM employee WHERE id = $1',
        [decoded.id]
      );

      const employee = employeeResult.rows[0];
      
      // Générer un nouveau token
      return this.generateToken(employee, roles);
      
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement du token:', error.message);
      throw error;
    }
  }

  /**
   * Vérifie si un employé est connecté.
   * @param {number} employeeId - ID de l'employé.
   * @returns {Promise<boolean>}
   */
  async isConnected(employeeId) {
    try {
      const result = await pool.query(
        'SELECT is_connected FROM employee WHERE id = $1',
        [employeeId]
      );
      
      if (result.rows.length === 0) {
        return false;
      }
      
      return result.rows[0].is_connected;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de connexion:', error.message);
      return false;
    }
  }

  /**
   * Met à jour la dernière activité de l'employé.
   * @param {number} employeeId - ID de l'employé.
   * @returns {Promise<void>}
   */
  async updateActivity(employeeId) {
    try {
      await pool.query(
        'UPDATE employee SET last_activity_at = NOW() WHERE id = $1',
        [employeeId]
      );
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'activité:', error.message);
    }
  }
}

module.exports = new AuthService();