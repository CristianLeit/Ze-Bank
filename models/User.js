const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  tipo:           String,
  nome:           String,
  email:          { type: String, required: true, unique: true },
  senha:          { type: String, required: true },
  cpf:            String,
  rg:             String,
  data_nasc:      String,
  sexo:           String,
  signo:          String,
  mae:            String,
  pai:            String,
  cep:            String,
  endereco:       String,
  numero:         Number,
  bairro:         String,
  cidade:         String,
  estado:         String,
  telefone_fixo:  String,
  celular:        String
}, {
  collection: 'usuarios' // garante que use a coleção certa
});

// Hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

module.exports = mongoose.model('Usuario', UserSchema);
