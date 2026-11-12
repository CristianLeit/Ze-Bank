require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authMiddleware = require('./middleware/auth');


const app = express();
const PORT = process.env.PORT || 3000;


// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname)));


// Rotas de autenticação (camadas: routes -> controller -> service)
app.use('/api', require('./routes/auth'));


// Proxy para ocultar o token e buscar notícias
app.get('/api/news', async (req, res) => {
  try {
    const finnhubUrl = `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_TOKEN}`;
    const finResp = await fetch(finnhubUrl);
    if (!finResp.ok) {
      return res.status(finResp.status).json({ error: 'Erro na Finnhub' });
    }
    const newsArray = await finResp.json();
    return res.json(newsArray);
  } catch (err) {
    console.error('Erro ao buscar notícias:', err);
    return res.status(500).json({ error: 'Erro interno ao obter notícias' });
  }
});


// Rota protegida para manipular clientes
app.get('/api/clientes', authMiddleware, async (req, res) => {
  const Cliente = mongoose.model('clientes'); // supondo modelo já definido
  const clientes = await Cliente.find();
  res.json(clientes);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('scr/User/cliente.html', (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
      return res.status(401).send('Acesso negado. Faça login primeiro.');
  }
  res.sendFile(path.join(__dirname, 'scr', 'User', 'cliente.html'));
});


// Proxy para lista de ações (ticker) — esconde o token da brapi no back-end
app.get('/api/stocks/list', async (req, res) => {
  try {
    const BRAPI_TOKEN = process.env.BRAPI_TOKEN;
    const url = `https://brapi.dev/api/quote/list?sortBy=market_cap_basic&sortOrder=desc&limit=50&token=${BRAPI_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar lista de ações' });
  }
});

// Proxy para dados de uma ação específica — esconde o token da brapi no back-end
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { range = '3mo' } = req.query;
    const BRAPI_TOKEN = process.env.BRAPI_TOKEN;
    const url = `https://brapi.dev/api/quote/${symbol}?range=${range}&interval=1d&fundamental=true&modules=summaryProfile&token=${BRAPI_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados da ação' });
  }
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Inicia o servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}


module.exports = app;
