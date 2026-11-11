require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const Usuario = require('./models/User')
const bcrypt = require('bcryptjs');


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



// Rota de cadastro de usuário
app.post('/api/register', async (req, res) => {
  try {
    const { name, cpf, date_of_birth ,email, password, phone } = req.body;

    // Verifica se o email já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado!' });
    }

    // Gera hash para a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria novo usuário
    const novoUsuario = new Usuario({
      name,
      cpf,
      date_of_birth,
      email,
      password: hashedPassword,
      phone,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Salva no banco
    await novoUsuario.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




app.post('/api/refresh-token', authMiddleware, (req, res) => {
  try {
    const novoToken = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: novoToken });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
});




// Rota de login (autenticação)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Email recebido:', email);
  console.log('Senha recebida:', password);

  try {
    // Busca o usuário pelo email
    const user = await Usuario.findOne({ email });

    if (!user) {
      console.log('❌ Usuário não encontrado no banco');
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    console.log('✅ Usuário encontrado:', user.name);
  
    const senhaCorreta = await user.comparePassword(password);
    if (!senhaCorreta) {
      console.log('❌ Senha incorreta!');
      return res.status(400).json({ error: 'Senha inválida' });
    }

    console.log('🔑 Login bem-sucedido! Gerando token...');
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
      res.json({ token });
      console.log("🔍 Token gerado:", token);


  } catch (error) {
    console.error('🔥 Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.get('/api/profile', authMiddleware, async (req, res) => {
  console.log("🔍 Token recebido na rota profile:", req.header("x-auth-token"));
  try {
    console.log("✅ Middleware autenticado. Dados do usuário:", req.user); 
    // req.user.id foi setado pelo authMiddleware via JWT
    const usuario = await Usuario.findById(req.user.id).select('-senha -__v');
    
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error('🔥 Erro interno ao obter perfil:', err);
    res.status(500).json({ error: 'Erro interno ao obter perfil' });
  }
});

// Exemplo de rota protegida para manipular clientes
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
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


