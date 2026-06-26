// backend/src/modules/users/user.repository.ts
// MUDANÇA: removidos street, number, complement, neighborhood
// do tipo do updateProfile

import User, { UserAttributes, UserStatus } from './user.model';
import { Op } from 'sequelize';

export class UserRepository {
  async create(data: UserAttributes): Promise<User> {
    return User.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email: email.toLowerCase() } });
  }

  async findByCPF(cpf: string): Promise<User | null> {
    return User.findOne({ where: { cpf } });
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async findAll(): Promise<User[]> {
    return User.findAll({
      attributes: { exclude: ['password'] },
      order:      [['createdAt', 'DESC']],
    });
  }

  async findAllContributors(): Promise<User[]> {
    return User.findAll({
      where:      { role: 'CONTRIBUTOR' },
      attributes: { exclude: ['password'] },
      order:      [['createdAt', 'DESC']],
    });
  }

  async findAllAdmins(): Promise<User[]> {
    return User.findAll({
      where:      { role: { [Op.in]: ['ADMIN', 'SUPERADMIN'] } },
      attributes: { exclude: ['password'] },
      order:      [['createdAt', 'DESC']],
    });
  }

  async updateStatus(
    id:        number,
    status:    UserStatus,
    banReason: string | null,
  ): Promise<void> {
    await User.update(
      { status, banReason },
      { where: { id } },
    );
  }

  async updateProfile(
    id:   number,
    data: Partial<Pick<UserAttributes,
      'email' | 'phone' | 'zipCode' | 'city' | 'state' | 'password'
    >>,
    // MUDANÇA: removidos street, number, complement, neighborhood do Pick
  ): Promise<void> {
    await User.update(data, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await User.destroy({ where: { id } });
  }
}