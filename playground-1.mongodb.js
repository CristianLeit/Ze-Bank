/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

use('sistemaEmprestimos');

// 1. Usuário gerente
db.getCollection('usuarios').insertOne({
  tipo: 'gerente',
  nome: 'Admin',
  email: 'admin@email.com',
  senha: '123456' // Ideal usar bcrypt numa aplicação real
});

// 2. Clientes
db.getCollection('clientes').insertMany([
  {
    nome: 'João Silva',
    rg: '1234567',
    cpf: '123.456.789-00',
    telefone: '11999999999',
    email: 'joaosilvionho7@gmail.com',
    dataNasc: new Date('2000-01-01'),
    scoreCredito: true,
    endereco: {
      rua: 'Av. Maia',
      numero: '300',
      bairro: 'Cumbica',
      cidade: 'Guarulhos',
      uf: 'SP',
      cep: '07278-880'
    },
    contatoEmergencia: {
      nome: 'Carla',
      telefone: '1199956432',
      grauParentesco: 'mãe'
    },
    dataCadastro: new Date(),
    atualizadoEm: new Date()
  },
  {
    nome: 'Maria Oliveira',
    rg: '7654321',
    cpf: '987.654.321-00',
    telefone: '11888888888',
    email: 'mariaoliver1@gmail.com',
    dataNasc: new Date('1998-11-09'),
    scoreCredito: true,
    endereco: {
      rua: 'Av. Brasil',
      numero: '456',
      bairro: 'Pimentas',
      cidade: 'Guarulhos',
      uf: 'SP',
      cep: '07270-070'
    },
    contatoEmergencia: {
      nome: 'Silvio',
      telefone: '1123456432',
      grauParentesco: 'tio'
    },
    dataCadastro: new Date(),
    atualizadoEm: new Date()
  }
]);

// 3. Empréstimos
db.getCollection('emprestimos').insertMany([
  {
    clienteCpf: '123.456.789-00',
    valor: 1000,
    taxa: 5,
    modalidade: 'composta',
    totalParcelas: 12,
    parcelasPagas: 0,
    dataInicio: new Date('2024-01-01'),
    dataFim: new Date('2025-06-06'),
    status: 'ativo',
    saldoDevedor: 1000,
    proximaDataVencimento: new Date('2024-02-01'),
    pagamentos: [],
    dataQuitacao: null,
    criadoEm: new Date(),
    atualizadoEm: new Date()
  },
  {
    clienteCpf: '987.654.321-00',
    valor: 500,
    taxa: 3,
    modalidade: 'simples',
    totalParcelas: 6,
    parcelasPagas: 0,
    dataInicio: new Date('2024-03-01'),
    dataFim: new Date('2024-09-01'),
    status: 'ativo',
    saldoDevedor: 500,
    proximaDataVencimento: new Date('2024-04-01'),
    pagamentos: [],
    dataQuitacao: null,
    criadoEm: new Date(),
    atualizadoEm: new Date()
  }
]);
