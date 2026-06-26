import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import userRoutes       from './modules/users/user.routes';
import magazineRoutes   from './modules/magazines/magazine.routes';
import suggestionRoutes from './modules/suggestions/suggestion.routes';
import categoryRoutes   from './modules/categories/category.routes';
import adminRoutes      from './modules/admin/admin.routes';

import { AppError } from './shared/AppError';
import logger from './utils/logger';

const app = express();

// Segurança — helmet adiciona headers HTTP de segurança (requisito da rubrica)
app.use(helmet());

// CORS — permite que o frontend consuma a API
app.use(cors({
  origin: process.env['CORS_ORIGIN'] ?? '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API do Elo Acadêmico está operacional' });
});

// SOLID - SRP: app.ts é responsável apenas por montar middlewares e rotas globais
app.use('/api/users',       userRoutes);
app.use('/api/magazines',   magazineRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/categories',  categoryRoutes);
app.use('/api/admin',       adminRoutes);

// Tratamento global de erros
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  logger.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

export default app;
