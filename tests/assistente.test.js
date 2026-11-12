const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('POST /api/assistente/webhook', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('returns 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/assistente/webhook')
      .send({ projectId: 'ze-bank', sessionId: 'sess-1' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 403 when projectId does not match', async () => {
    const res = await request(app)
      .post('/api/assistente/webhook')
      .send({ projectId: 'outro-projeto', message: 'oi', sessionId: 'sess-1' });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Projeto não autorizado');
  });

  it('answers loan questions with faq source', async () => {
    const res = await request(app)
      .post('/api/assistente/webhook')
      .send({ projectId: 'ze-bank', message: 'Como faço um empréstimo?', sessionId: 'sess-1' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('source', 'ze-bank-faq');
    expect(res.body.reply.toLowerCase()).toContain('empréstimo');
  });

  it('answers login questions', async () => {
    const res = await request(app)
      .post('/api/assistente/webhook')
      .send({ projectId: 'ze-bank', message: 'Não consigo fazer login', sessionId: 'sess-2' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('source', 'ze-bank-faq');
  });

  it('returns fallback for unknown questions', async () => {
    const res = await request(app)
      .post('/api/assistente/webhook')
      .send({ projectId: 'ze-bank', message: 'zzzzz nada a ver', sessionId: 'sess-3' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('source', 'ze-bank-fallback');
  });
});
