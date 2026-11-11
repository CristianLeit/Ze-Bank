const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth Endpoints', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 404 for non-existent routes', async () => {
    const res = await request(app).get('/api/undefined-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Endpoint não encontrado');
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'nonexistent@zbank.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail registration with invalid CPF', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        cpf: '123.456.789-00', // CPF Inválido
        email: 'test@zbank.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'CPF inválido!');
  });
});
