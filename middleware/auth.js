const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  console.log("🛠️ Headers:", req.headers);
  let token = req.header('x-auth-token') || '';

  // opcionalmente, suportar Authorization Bearer
  if (!token && req.header('Authorization')) {
    const [scheme, cred] = req.header('Authorization').split(' ');
    if (scheme === 'Bearer') token = cred;
  }

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado: token não fornecido' });
  }

  console.log("🔍 Token chegando ao verify:", token);
  console.log("🔑 Secret no middleware:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❗ JWT verification error:", err.name, err.message);
    return res.status(400).json({ error: 'Token inválido', reason: err.message });
  }
}

module.exports = authMiddleware;
