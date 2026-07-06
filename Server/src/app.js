const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());  // pour parser le JSON des requêtes
app.use(morgan('dev'));   // logs dans la console



// Modules
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/production/lots', require('./modules/production/lot/lot.routes'));
app.use('/api/admin', require('./modules/Admin/admin.routes'));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

module.exports = app;

