const Usuario = require('../models/User');
const jwt = require('jsonwebtoken');
const { validarCPF } = require('../utils/validators');

class AuthService {
  async register(userData) {
    const { cpf, email } = userData;
    if (!validarCPF(cpf)) {
      throw Object.assign(new Error('CPF inválido!'), { status: 400 });
    }
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      throw Object.assign(new Error('Email já cadastrado!'), { status: 400 });
    }

    const novoUsuario = new Usuario({
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    });

    return await novoUsuario.save();
  }

  async login(email, password) {
    const user = await Usuario.findOne({ email });
    if (!user) {
      throw Object.assign(new Error('Usuário não encontrado'), { status: 400 });
    }

    const senhaCorreta = await user.comparePassword(password);
    if (!senhaCorreta) {
      throw Object.assign(new Error('Senha inválida'), { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user };
  }

  async getProfile(userId) {
    const usuario = await Usuario.findById(userId).select('-password -__v');
    if (!usuario) {
      throw Object.assign(new Error('Usuário não encontrado'), { status: 404 });
    }
    return usuario;
  }

  async refreshToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}

module.exports = new AuthService();
