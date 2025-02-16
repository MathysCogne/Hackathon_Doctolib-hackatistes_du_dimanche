// src/middlewares/authMiddleware.js
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Vérifie l'existence d'un header Authorization
  if (!authHeader) {
    return res.status(401).json({ error: "Token manquant" });
  }
  
  // Pour un header de type "Bearer mon-token-secret"
  const token = authHeader.split(" ")[1];
  
  if (token !== process.env.MONGO_TOKEN) {
    return res.status(403).json({ error: "Token invalide" });
  }
  
  // Le token est valide, passage au middleware suivant
  next();
};


