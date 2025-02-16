// src/app.js
require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./config/db');
const elizaRoutes = require('./routes/elizaRoutes');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
connectToDatabase();

// Utilisation des routes pour l'API "Eliza"
app.use('/eliza', elizaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

