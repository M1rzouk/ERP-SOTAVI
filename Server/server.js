require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 3000;

pool.connect()
  .then(() => console.log('✅ Connecté à PostgreSQL'))
  .catch(err => console.error('❌ Erreur DB', err));

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});