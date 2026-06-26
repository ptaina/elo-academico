# Elo Acadêmico

Plataforma web de centralização de informações de revistas científicas com classificação Qualis da CAPES.

## Estrutura do Projeto

```
elo-academico/
├── backend/        Node.js + Express + TypeScript + Sequelize + MySQL
├── frontend/       React + TypeScript + Vite
├── nginx/          Proxy reverso (roteia /api → backend, / → frontend)
├── docs/           Documentação técnica (DER e fluxo de usuário)
└── docker-compose.yml
```

## Documentação

| Arquivo | Descrição |
|---------|-----------|
| [docs/der.md](docs/der.md) | Diagrama Entidade-Relacionamento (DER) |
| [docs/user-flow.md](docs/user-flow.md) | Fluxo de navegação por perfil de usuário |

## Pré-requisitos

- Docker e Docker Compose instalados

## Subir com Docker (recomendado)

```bash
# 1. Na raiz do projeto, crie o arquivo de variáveis
cp backend/.env.example backend/.env

# 2. Subir todos os serviços
docker compose up -d --build

# 3. Criar o primeiro administrador (superadmin)
docker compose exec backend npm run seed

# 4. Acessar a plataforma
# http://localhost
```

## Desenvolvimento local (sem Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Ajuste as variáveis de banco no .env
npm install
npm run seed      # Cria o superadmin
npm run dev       # http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

> Em desenvolvimento local, o Vite faz proxy de `/api` → `localhost:3000` via `vite.config.ts`, eliminando problemas de CORS. Em produção com Docker, o nginx assume esse papel roteando as requisições entre frontend e backend.

## Credenciais padrão do superadmin

```
E-mail: admin@eloacademico.com.br
Senha:  Admin@2024!
```

**Troque a senha após o primeiro acesso.**

## Testes (backend)

Os testes rodam localmente. Para os testes de integração é necessário ter o MySQL do Docker rodando e criar o banco de teste:

```bash
# Criar o banco de teste (apenas uma vez)
docker compose exec db mysql -u root -proot_password -e "CREATE DATABASE IF NOT EXISTS elo_academico_test; GRANT ALL PRIVILEGES ON elo_academico_test.* TO 'elo_user'@'%'; FLUSH PRIVILEGES;"

# Rodar os testes
cd backend
npm install
npm run test:unit          # Testes unitários (validators: CPF, e-mail, ISSN)
npm run test:integration   # Testes de integração (CRUD de usuários)
npm test                   # Todos os testes
```

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/users/register | Cadastrar contribuidor |
| POST | /api/users/login | Login |
| GET | /api/users/me | Perfil próprio |
| PATCH | /api/users/me | Atualizar perfil |
| DELETE | /api/users/me | Excluir própria conta |
| POST | /api/users/recover-password | Recuperar senha via CPF |
| POST | /api/users/admin | Criar administrador (superadmin) |
| PATCH | /api/users/:id/block | Banir contribuidor (admin) |
| GET | /api/magazines | Listar/buscar revistas (público) |
| POST | /api/magazines | Cadastrar revista (admin) |
| PUT | /api/magazines/:id | Editar revista (admin) |
| DELETE | /api/magazines/:id | Excluir revista (admin) |
| POST | /api/suggestions | Sugerir revista (contribuidor) |
| GET | /api/suggestions/my | Minhas sugestões (contribuidor) |
| PATCH | /api/suggestions/:id/approve | Aprovar sugestão (admin) |
| PATCH | /api/suggestions/:id/reject | Recusar sugestão com motivo (admin) |
| GET | /api/categories | Listar categorias (público) |
| POST | /api/categories | Criar categoria (admin) |
| DELETE | /api/categories/:id | Excluir categoria (admin) |
| GET | /api/admin/stats | Estatísticas do dashboard (admin) |

## Perfis de usuário

| Perfil | Descrição |
|--------|-----------|
| **Visitante** | Acessa a plataforma sem login. Pode pesquisar revistas por filtros e barra de busca |
| **Contribuidor** | Cadastrado na plataforma. Pode sugerir revistas e acompanhar o status das sugestões |
| **Admin** | Gerencia revistas, categorias, sugestões e contribuidores. Pode banir contribuidores |
| **Superadmin** | Primeiro administrador criado via seed. Pode criar e excluir outros administradores |

## Tecnologias

**Backend:** Node.js, Express, TypeScript, Sequelize, MySQL, JWT, bcrypt, Winston

**Frontend:** React, TypeScript, Vite, React Router, CSS Modules

**Infra:** Docker, Docker Compose, nginx

## Princípios SOLID aplicados

- **SRP** (Single Responsibility): cada módulo tem responsabilidade única — `model`, `repository`, `service`, `controller` e `routes` separados por entidade
- **DIP** (Dependency Inversion): services recebem repositories pelo construtor (injeção de dependência), não instanciam diretamente