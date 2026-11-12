const AssistenteService = require('../services/assistenteService');

class AssistenteController {
  /**
   * Webhook chamado pela Asyntia.
   * Body esperado: { projectId, sessionId, message, timestamp }
   */
  async responder(req, res) {
    try {
      const { projectId, message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Campo "message" é obrigatório' });
      }

      if (projectId !== process.env.ASSISTENTE_PROJECT_ID) {
        return res.status(403).json({ error: 'Projeto não autorizado' });
      }

      const resposta = AssistenteService.responder(message);
      return res.json(resposta);
    } catch (error) {
      console.error('Erro no webhook do assistente:', error);
      return res.status(500).json({ error: 'Erro ao processar mensagem' });
    }
  }
}

module.exports = new AssistenteController();
