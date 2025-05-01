require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

// Definição do modelo de Usuário
const UserSchema = new mongoose.Schema({
  tipo: String,
  nome: String,
  email: String,
  senha: String
}, { collection: 'usuarios' });

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


// Temporariamente desativado porque bcrypt não está sendo usado
/* UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
 */
const User = mongoose.model('usuarios', UserSchema);

// Middleware de autenticação JWT
function authMiddleware(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'Acesso negado: token não fornecido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Token inválido' });
  }
}

// Rota de login (autenticação)
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  
  console.log('Email recebido:', email);
  console.log('Senha recebida:', senha);

  try {
    // Busca o usuário pelo email
    const usuario = await User.findOne({ email });

    if (!usuario) {
      console.log('❌ Usuário não encontrado no banco');
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    console.log('✅ Usuário encontrado:', usuario);
    console.log('Senha no banco:', usuario.senha); // Agora essa linha está no lugar certo

    // Verifica se a senha está correta
    const senhaCorreta = senha === usuario.senha;
    if (!senhaCorreta) {
      console.log('❌ Senha incorreta!');
      return res.status(400).json({ error: 'Senha inválida' });
    }

    console.log('🔑 Login bem-sucedido! Gerando token...');
    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    console.error('🔥 Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exemplo de rota protegida para manipular clientes
app.get('/api/clientes', authMiddleware, async (req, res) => {
  const Cliente = mongoose.model('Cliente'); // supondo modelo já definido
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
  res.sendFile(path.join(__dirname, 'User', 'cliente.html'));
});


// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


