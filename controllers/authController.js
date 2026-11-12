const AuthService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      await AuthService.register(req.body);
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { token, user } = await AuthService.login(req.body.email, req.body.password);
      res.json({ token, user });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async profile(req, res) {
    try {
      const profile = await AuthService.getProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const token = await AuthService.refreshToken(req.user);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao renovar token' });
    }
  }
}

module.exports = new AuthController();
