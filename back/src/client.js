// src/client.js
require('dotenv').config();
const axios = require('axios');

// Récupérez l'UUID passé en argument ou utilisez une valeur par défaut
const uuid = process.argv[2] || 'default-uuid';

const BASE_URL = `http://localhost:${process.env.PORT || 3000}/eliza`;

// Configuration d'Axios pour ajouter le token Bearer dans les headers.
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${process.env.TOKEN}` },
});

// Exemple d'appel POST pour créer un document avec l'UUID fourni
async function createDocument() {
  try {
    const response = await apiClient.post(`/${uuid}`, { name: 'John Doe', age: 30 });
    console.log('POST réponse:', response.data);
  } catch (error) {
    console.error('Erreur POST:', error.response ? error.response.data : error.message);
  }
}

// Exemple d'appel GET pour récupérer des documents pour un UUID donné
async function getDocuments() {
  try {
    const response = await apiClient.get(`/${uuid}`);
    console.log('GET réponse:', response.data);
  } catch (error) {
    console.error('Erreur GET:', error.response ? error.response.data : error.message);
  }
}

// Exemple d'appel DELETE pour supprimer des documents associés à l'UUID donné
async function deleteDocuments() {
  try {
    const response = await apiClient.delete(`/${uuid}`);
    console.log('DELETE réponse:', response.data);
  } catch (error) {
    console.error('Erreur DELETE:', error.response ? error.response.data : error.message);
  }
}

// Vous pouvez lancer les appels en fonction de vos besoins.
// Ici on réalise la chaîne : create -> get -> delete.
createDocument()
  .then(() => getDocuments())
  .then(() => deleteDocuments());

