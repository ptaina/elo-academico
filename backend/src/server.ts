import app from './app';
import sequelize from './config/database';
import { env } from './config/env';
import logger from './utils/logger';

// Importa os modelos para que o Sequelize os reconheça no sync
import './modules/users/user.model';
import './modules/categories/category.model';
import './modules/magazines/magazine.model';
import './modules/suggestions/suggestion.model';

async function bootstrap(): Promise<void> {
  try {
    // Testa conexão com o banco de dados
    await sequelize.authenticate();
    logger.info('Conexão com o banco de dados estabelecida com sucesso');

    // Sincroniza os modelos (cria tabelas se não existirem)
    await sequelize.sync({ alter: false });
    logger.info('Tabelas sincronizadas');

    app.listen(env.port, () => {
      logger.info(`Servidor rodando na porta ${env.port} | Ambiente: ${env.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

void bootstrap();
