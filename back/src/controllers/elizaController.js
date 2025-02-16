// src/controllers/elizaController.js
const { getCollection } = require('../config/db');

// GET : Récupère les documents par UUID.
// Si aucun document n'est trouvé pour cet UUID ou si aucun UUID n'est fourni,
// renvoie la liste unique des UUID existants dans la collection.
exports.getDocuments = async (req, res) => {
  const userUuid = req.params.uuid;
  
  try {
    const collection = getCollection();

    if (!userUuid) {
      // Si aucun UUID fourni, renvoie tous les UUID disponibles
      const uuids = await collection.distinct("uuid");
      return res.json({ message: "Liste des UUID disponibles", uuids });
    }

    const documents = await collection.find({ uuid: userUuid }).toArray();

    if (documents.length === 0) {
      // Aucun document trouvé pour cet UUID → renvoie la liste des UUID existants
      const uuidList = await collection.distinct("uuid");
      return res.status(404).json({ 
        message: "Aucune donnée trouvée pour cet UUID. Liste des UUID disponibles :",
        uuids: uuidList
      });
    }

    return res.json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
};

// POST : Crée un document pour l'UUID fourni.
exports.createDocument = async (req, res) => {
  const userUuid = req.params.uuid;
  const data = req.body; 

  try {
    const collection = getCollection();

    // Ajoute l'UUID dans le document à insérer
    const document = { uuid: userUuid, ...data };

    const result = await collection.insertOne(document);
    return res.status(201).json({ message: "Document créé", result });
  } catch (error) {
    console.error("Erreur lors de la création du document :", error);
    return res.status(500).json({ error: "Erreur lors de la création du document" });
  }
};

// DELETE : Supprime les documents associés à l'UUID fourni.
exports.deleteDocuments = async (req, res) => {
  const userUuid = req.params.uuid;
  
  try {
    const collection = getCollection();

    const result = await collection.deleteMany({ uuid: userUuid });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Aucun document trouvé pour suppression" });
    }
    return res.json({ message: "Documents supprimés", count: result.deletedCount });
  } catch (error) {
    console.error("Erreur lors de la suppression des documents :", error);
    return res.status(500).json({ error: "Erreur lors de la suppression des documents" });
  }
};

