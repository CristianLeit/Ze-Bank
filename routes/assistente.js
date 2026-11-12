const express = require('express');
const assistenteController = require('../controllers/assistenteController');

const router = express.Router();

// Recebe mensagens encaminhadas pela Asyntia e devolve respostas do domínio Zé Bank
router.post('/webhook', assistenteController.responder);

module.exports = router;
