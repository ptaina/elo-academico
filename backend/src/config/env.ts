import dotenv from 'dotenv';

dotenv.config();

// Garante que as variáveis obrigatórias existam em runtime — SRP: validação de config isolada
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',

  db: {
    host: process.env['DB_HOST'] ?? 'localhost',
    port: parseInt(process.env['DB_PORT'] ?? '3306', 10),
    name: process.env['DB_NAME'] ?? 'elo_academico',
    user: process.env['DB_USER'] ?? 'root',
    password: process.env['DB_PASSWORD'] ?? '',
  },

  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: (process.env['JWT_EXPIRES_IN'] ?? '8h') as string,
};
