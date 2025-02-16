const express = require('express');
const router = express.Router();
const elizaController = require('../controllers/elizaController');
const authenticateToken = require('../middlewares/authMiddleware');

// Route POST pour créer un document
router.post('/:uuid', authenticateToken, elizaController.createDocument);

// Route GET pour récupérer des documents
router.get('/:uuid', authenticateToken, elizaController.getDocuments);

// Route DELETE pour supprimer des documents
router.delete('/:uuid', authenticateToken, elizaController.deleteDocuments);

module.exports = router;

