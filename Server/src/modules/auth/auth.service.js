const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

// Clé secrète pour JWT – à stocker dans .env !
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN; // ex: '24h'

class AuthService {
  /**
   * Authentifie un employé par son matricule et mot de passe.
   * @param {string} matricule - Matricule unique de l'employé.
   * @param {string} password - Mot de passe en clair.
   * @returns {Promise<{token: string, employee: object}>}
   * @throws {Error} Si identifiants invalides ou compte inactif.
   */
  async login(matricule, password) {
    // 1. Rechercher l'employé par matricule
    const result = await pool.query(
      `SELECT id, matricule, username, email, password_hash, full_name, is_active 
       FROM employee 
       WHERE matricule = $1`,
      [matricule]
    );

    if (result.rows.length === 0) {
      throw new Error('Matricule non trouvé');
    }

    const employee = result.rows[0];

    // 2. Vérifier si le compte est actif
    if (!employee.is_active) {
      throw new Error('Compte désactivé. Contactez l’administrateur.');
    }

    // 3. Comparer le mot de passe fourni avec le hash stocké
    const isMatch = await bcrypt.compare(password, employee.password_hash);
    if (!isMatch) {
      throw new Error('Mot de passe incorrect');
    }

    //This query retrieves all roles assigned to a specific employee, and for each role it returns its associated permissions as a JSON array; 
    // if a role has no permissions, it returns an empty array [] instead of null.
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

    await pool.query(
      `UPDATE employee SET last_login_at = NOW(), is_connected = TRUE, 
         last_activity_at = NOW() WHERE id = $1`,
      [employee.id]
    );

    // 4. Générer un token JWT
    const token = this.generateToken(employee, roles);

    // 5. Retourner le token et les infos employé (sans le hash)
    delete employee.password_hash;
    return { token, employee, roles };
  }

  async logout(employeeId) {
    await pool.query(
      `UPDATE employee SET is_connected = FALSE WHERE id = $1`,
      [employeeId]
    );
    return true;
  }

  /**
   * Génère un token JWT pour un employé.
   * @param {object} employee - Objet employé (avec id, matricule, etc.)
   * @returns {string} Token JWT
   */
  generateToken(employee, roles) {
    const permissions = [...new Set(roles.flatMap(r => r.permissions))];
    const payload = {
      id: employee.id,
      matricule: employee.matricule,
      fullName: employee.full_name,
      roles: roles.map(r => r.name),
      permissions: permissions
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
  /**
   * Vérifie la validité d'un token JWT.
   * @param {string} token - Token à vérifier.
   * @returns {object} Payload décodé.
   * @throws {Error} Si token invalide ou expiré.
   */
  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}

module.exports = new AuthService();