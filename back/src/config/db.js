// src/config/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(process.env.DATABASE_URL, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(); // Utilise la valeur de database figurant dans DATABASE_URL
    console.log('Connexion à MongoDB réussie.');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
    process.exit(1);
  }
}

function getCollection() {
  if (!db) {
    throw new Error('Base de données non initialisée');
  }
  return db.collection('eliza'); // Nom de la collection
}

module.exports = { connectToDatabase, getCollection };

