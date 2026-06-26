// backend/src/seeds/createFirstAdmin.ts
//
// MUDANÇA: o arquivo saiu de scripts/createFirstAdmin.ts para cá.
// Motivo: dentro de src/ ele é compilado pelo tsc junto com o resto
// da aplicação e vai parar em dist/seeds/createFirstAdmin.js.
// Na imagem Docker de produção só existe dist/, então o import
// de '../config/database' passa a funcionar corretamente.
//
// Seed idempotente: verifica se já existe um SUPERADMIN antes de criar.
// Pode rodar quantas vezes quiser sem duplicar dados.

import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database';
import User, { UserRole, UserStatus } from '../modules/users/user.model';
import '../modules/categories/category.model';
import '../modules/magazines/magazine.model';
import '../modules/suggestions/suggestion.model';
import bcrypt from 'bcryptjs';

const SUPERADMIN_EMAIL    = process.env['SUPERADMIN_EMAIL']    ?? 'admin@eloacademico.com.br';
const SUPERADMIN_PASSWORD = process.env['SUPERADMIN_PASSWORD'] ?? 'Admin@2024!';

async function seed(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco de dados.');

    await sequelize.sync({ alter: false });
    console.log('Tabelas sincronizadas.');

    // Idempotência: se já existe um superadmin, não faz nada
    const existing = await User.findOne({
      where: { role: UserRole.SUPERADMIN },
    });

    if (existing) {
      console.log(`Superadmin já existe: ${existing.email}. Nenhuma ação necessária.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);

    await User.create({
      name:     'Administrador Principal',
      email:    SUPERADMIN_EMAIL,
      password: hashedPassword,
      role:     UserRole.SUPERADMIN,
      status:   UserStatus.ACTIVE,
    });

    console.log('');
    console.log('=================================================');
    console.log(' Superadmin criado com sucesso!');
    console.log(`  E-mail: ${SUPERADMIN_EMAIL}`);
    console.log(`  Senha:  ${SUPERADMIN_PASSWORD}`);
    console.log(' ATENÇÃO: Altere a senha após o primeiro acesso!');
    console.log('=================================================');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar superadmin:', error);
    process.exit(1);
  }
}

void seed();