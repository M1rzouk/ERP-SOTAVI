const pool = require('../../../config/db');

class LotService {
  async createLot(data) {
    let code = data.code;
    const { imported_batch_id, product_id, center_id, quantity_initial, status_id } = data;

    if (!code) {
      console.log('Recherche catégorie pour product_id =', product_id);
      const catResult = await pool.query(
        `SELECT pc.type 
         FROM product p
         JOIN product_category pc ON p.category_id = pc.id
         WHERE p.id = $1`,
        [product_id]
      );
      if (catResult.rows.length === 0) {
        throw new Error('Produit non trouvé ou catégorie manquante');
      }
      const categoryType = catResult.rows[0].type; // 'ponte' ou 'chair'
      const suffix = categoryType === 'ponte' ? 'P' : 'C';

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      code = `LOT-${day}-${month}-${year}${suffix}-${hours}${minutes}${seconds}`;
    }

    const result = await pool.query(
      `INSERT INTO lot (code, imported_batch_id, product_id, center_id, quantity_initial, status_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [code, imported_batch_id, product_id, center_id, quantity_initial, status_id]
    );
    return result.rows[0];
  }

  async getLots(filters = {}) {
    let query = `SELECT * FROM lot`;
    const conditions = [];
    const values = [];
    if (filters.center_id) {
      conditions.push(`center_id = $${values.length + 1}`);
      values.push(filters.center_id);
    }
    if (filters.status_id) {
      conditions.push(`status_id = $${values.length + 1}`);
      values.push(filters.status_id);
    }
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ` ORDER BY created_at DESC`;
    const result = await pool.query(query, values);
    return result.rows;
  }

  async getLotById(id) {
    const result = await pool.query('SELECT * FROM lot WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = new LotService();