/// <reference types="jest" />
import request    from 'supertest';
import app        from '../../src/app';
import sequelize  from '../../src/config/database';
import User       from '../../src/modules/users/user.model';

// Testes de integração do CRUD de usuários — requisito da rubrica (2 tipos de teste)
// Valida os endpoints reais do Express com banco de dados de teste

beforeAll(async () => {
  await import('../../src/modules/users/user.model');
  await import('../../src/modules/categories/category.model');
  await import('../../src/modules/magazines/magazine.model');
  await import('../../src/modules/suggestions/suggestion.model');
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(async () => {
  await User.destroy({ where: {}, truncate: true });
});

// MUDANÇA: removidos street, neighborhood e number — campos não existem mais no modelo
const validContributor = {
  name:            'João Silva',
  email:           'joao@teste.com',
  password:        'Senha@2024!',
  confirmPassword: 'Senha@2024!',
  cpf:             '529.982.247-25',
  phone:           '(44) 99999-8888',
  zipCode:         '87301-005',
  city:            'Campo Mourão',
  state:           'PR',
};

describe('POST /api/users/register — cadastro de contribuidor', () => {
  it('deve criar um contribuidor com dados válidos', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send(validContributor);

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('joao@teste.com');
    expect(response.body.user.role).toBe('CONTRIBUTOR');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('deve rejeitar cadastro com CPF inválido', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ ...validContributor, cpf: '111.111.111-11' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/CPF inválido/i);
  });

  it('deve rejeitar cadastro com e-mail inválido', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ ...validContributor, email: 'nao-e-email' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/e-mail inválido/i);
  });

  // MUDANÇA: CPF corrigido para um válido matematicamente (111.444.777-35)
  it('deve rejeitar cadastro com e-mail duplicado', async () => {
    await request(app).post('/api/users/register').send(validContributor);

    const response = await request(app)
      .post('/api/users/register')
      .send({ ...validContributor, cpf: '111.444.777-35' });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/e-mail já cadastrado/i);
  });

  it('deve rejeitar quando as senhas não conferem', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ ...validContributor, confirmPassword: 'SenhaErrada@2024!' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/senhas não conferem/i);
  });
});

describe('POST /api/users/login — login', () => {
  beforeEach(async () => {
    await request(app).post('/api/users/register').send(validContributor);
  });

  it('deve retornar token JWT com credenciais válidas', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'joao@teste.com', password: 'Senha@2024!' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('joao@teste.com');
  });

  it('deve rejeitar login com senha incorreta', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'joao@teste.com', password: 'SenhaErrada@2024!' });

    expect(response.status).toBe(401);
  });

  it('deve rejeitar login com e-mail inexistente', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'naoexiste@teste.com', password: 'Senha@2024!' });

    expect(response.status).toBe(401);
  });
});

describe('GET /api/users/me — perfil autenticado', () => {
  let token: string;

  beforeEach(async () => {
    await request(app).post('/api/users/register').send(validContributor);
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({ email: 'joao@teste.com', password: 'Senha@2024!' });
    token = loginResponse.body.token;
  });

  it('deve retornar os dados do usuário autenticado', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('joao@teste.com');
    expect(response.body).not.toHaveProperty('password');
  });

  it('deve rejeitar requisição sem token', async () => {
    const response = await request(app).get('/api/users/me');
    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/users/me — exclusão de conta', () => {
  let token: string;

  beforeEach(async () => {
    await request(app).post('/api/users/register').send(validContributor);
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({ email: 'joao@teste.com', password: 'Senha@2024!' });
    token = loginResponse.body.token;
  });

  it('deve excluir a própria conta', async () => {
    const response = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const checkResponse = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(checkResponse.status).toBe(404);
  });
});