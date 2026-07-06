// modules/Admin/admin.service.js
const bcrypt = require('bcrypt');
const pool = require('../../config/db');

// Vérification que la base de données est connectée
console.log('✅ pool chargé:', !!pool);

class AdminService {
  /**
   * Récupère tous les rôles disponibles
   */
  async getRoles() {
    try {
      const result = await pool.query(
        'SELECT id, name FROM role ORDER BY name'
      );
      return result.rows;
    } catch (error) {
      console.error('❌ Erreur getRoles:', error);
      throw new Error('Erreur lors de la récupération des rôles');
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData) {
    const { matricule, email, full_name, password, roles } = userData;

    // Validation
    if (!matricule || !email || !full_name || !password || !roles || roles.length === 0) {
      throw new Error('Tous les champs sont requis');
    }

    try {
      // 1. Vérifier que le matricule ou l'email n'existent pas
      const checkResult = await pool.query(
        'SELECT id FROM employee WHERE matricule = $1 OR email = $2',
        [matricule.trim(), email.trim()]
      );

      if (checkResult.rows.length > 0) {
        throw new Error('Un utilisateur avec ce matricule ou cet email existe déjà');
      }

      // 2. Hasher le mot de passe
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 3. Insérer l'employé
      const result = await pool.query(
        `INSERT INTO employee (matricule, email, full_name, password_hash, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id, matricule, email, full_name, is_active, created_at`,
        [matricule.trim(), email.trim(), full_name.trim(), passwordHash]
      );

      const newEmployee = result.rows[0];

      // 4. Attribuer les rôles
      if (roles && roles.length > 0) {
        const values = roles.map(roleId => `(${newEmployee.id}, ${roleId})`).join(',');
        await pool.query(
          `INSERT INTO employee_role (employee_id, role_id) VALUES ${values}`
        );
      }

      // 5. Récupérer les rôles attribués
      const rolesResult = await pool.query(
        `SELECT r.id, r.name
         FROM employee_role er
         JOIN role r ON er.role_id = r.id
         WHERE er.employee_id = $1`,
        [newEmployee.id]
      );

      return {
        ...newEmployee,
        roles: rolesResult.rows
      };

    } catch (error) {
      console.error('❌ Erreur createUser:', error);
      throw error;
    }
  }

  /**
   * Récupère la liste des utilisateurs avec leurs rôles
   */
  async getUsers() {
    try {
      const result = await pool.query(
        `SELECT 
          e.id, e.matricule, e.email, e.full_name, e.is_active, e.created_at,
          COALESCE(
            (SELECT json_agg(r.name) 
             FROM employee_role er 
             JOIN role r ON er.role_id = r.id 
             WHERE er.employee_id = e.id),
            '[]'::json
          ) as roles
         FROM employee e
         ORDER BY e.created_at DESC`
      );
      return result.rows;
    } catch (error) {
      console.error('❌ Erreur getUsers:', error);
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(id, userData) {
    const { email, full_name, is_active, roles } = userData;

    try {
      // 1. Mettre à jour l'employé
      await pool.query(
        `UPDATE employee 
         SET email = $1, full_name = $2, is_active = $3
         WHERE id = $4`,
        [email, full_name, is_active, id]
      );

      // 2. Mettre à jour les rôles (supprimer les anciens et ajouter les nouveaux)
      await pool.query(
        'DELETE FROM employee_role WHERE employee_id = $1',
        [id]
      );

      if (roles && roles.length > 0) {
        const values = roles.map(roleId => `(${id}, ${roleId})`).join(',');
        await pool.query(
          `INSERT INTO employee_role (employee_id, role_id) VALUES ${values}`
        );
      }

      // 3. Récupérer l'utilisateur mis à jour
      const result = await pool.query(
        `SELECT id, matricule, email, full_name, is_active, created_at
         FROM employee WHERE id = $1`,
        [id]
      );

      const rolesResult = await pool.query(
        `SELECT r.id, r.name
         FROM employee_role er
         JOIN role r ON er.role_id = r.id
         WHERE er.employee_id = $1`,
        [id]
      );

      return {
        ...result.rows[0],
        roles: rolesResult.rows
      };

    } catch (error) {
      console.error('❌ Erreur updateUser:', error);
      throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  }

  /**
   * Désactive un utilisateur (suppression logique)
   */
  async deleteUser(id) {
    try {
      await pool.query(
        'UPDATE employee SET is_active = false WHERE id = $1',
        [id]
      );
      return true;
    } catch (error) {
      console.error('❌ Erreur deleteUser:', error);
      throw new Error('Erreur lors de la désactivation de l\'utilisateur');
    }
  }
}

module.exports = new AdminService();