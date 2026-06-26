// backend/src/modules/users/user.service.ts

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from './user.repository';
import { UserRole, UserAttributes, UserStatus } from './user.model';
import { AppError } from '../../shared/AppError';
import { isValidCPF, isValidEmail, isNotEmpty } from '../../utils/validators';
import logger from '../../utils/logger';
import { env } from '../../config/env';

// SOLID - SRP: regras de negócio de usuário isoladas nesta classe
// SOLID - DIP: recebe o repository pelo construtor (injeção de dependência)
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // Valida requisitos da senha — SRP: função com responsabilidade única
  private validatePassword(password: string): void {
    if (password.length < 8)
      throw new AppError('Senha deve ter no mínimo 8 caracteres', 400);
    if (!/[A-Z]/.test(password))
      throw new AppError('Senha deve ter pelo menos uma letra maiúscula', 400);
    if (!/[0-9]/.test(password))
      throw new AppError('Senha deve ter pelo menos um número', 400);
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      throw new AppError('Senha deve ter pelo menos um caractere especial', 400);
  }

  async registerContributor(data: {
    name:            string;
    email:           string;
    password:        string;
    confirmPassword: string;
    cpf:             string;
    phone:           string;
    zipCode:         string;
    city:            string;
    state:           string;
  }): Promise<Omit<UserAttributes, 'password'>> {
    if (!isNotEmpty(data.name))          throw new AppError('Nome é obrigatório', 400);
    if (!isNotEmpty(data.email))         throw new AppError('E-mail é obrigatório', 400);
    if (!isNotEmpty(data.password))      throw new AppError('Senha é obrigatória', 400);
    if (!isNotEmpty(data.confirmPassword)) throw new AppError('Confirmação de senha é obrigatória', 400);
    if (!isNotEmpty(data.cpf))           throw new AppError('CPF é obrigatório', 400);
    if (!isNotEmpty(data.phone))         throw new AppError('Telefone é obrigatório', 400);
    if (!isNotEmpty(data.zipCode))       throw new AppError('CEP é obrigatório', 400);
    if (!isNotEmpty(data.city))          throw new AppError('Cidade é obrigatória', 400);
    if (!isNotEmpty(data.state))         throw new AppError('Estado é obrigatório', 400);

    if (!isValidEmail(data.email)) throw new AppError('E-mail inválido', 400);
    if (!isValidCPF(data.cpf))     throw new AppError('CPF inválido', 400);

    this.validatePassword(data.password);

    if (data.password !== data.confirmPassword)
      throw new AppError('As senhas não conferem', 400);

    const cleanedCpf     = data.cpf.replace(/\D/g, '');
    const cleanedPhone   = data.phone.replace(/\D/g, '');
    const cleanedZipCode = data.zipCode.replace(/\D/g, '');

    const emailExists = await this.userRepository.findByEmail(data.email);
    if (emailExists) throw new AppError('E-mail já cadastrado', 409);

    const cpfExists = await this.userRepository.findByCPF(cleanedCpf);
    if (cpfExists) throw new AppError('CPF já cadastrado', 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name:     data.name.trim(),
      email:    data.email.toLowerCase().trim(),
      password: hashedPassword,
      cpf:      cleanedCpf,
      phone:    cleanedPhone,
      zipCode:  cleanedZipCode,
      city:     data.city.trim(),
      state:    data.state.trim().toUpperCase(),
      role:     UserRole.CONTRIBUTOR,
    });

    logger.info(`Novo contribuidor cadastrado: ${user.email} | ID: ${user.id}`);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async createAdmin(data: {
    email:    string;
    password: string;
  }): Promise<Omit<UserAttributes, 'password'>> {
    if (!isNotEmpty(data.email))    throw new AppError('E-mail é obrigatório', 400);
    if (!isNotEmpty(data.password)) throw new AppError('Senha é obrigatória', 400);
    if (!isValidEmail(data.email))  throw new AppError('E-mail inválido', 400);

    this.validatePassword(data.password);

    const emailExists = await this.userRepository.findByEmail(data.email);
    if (emailExists) throw new AppError('E-mail já cadastrado', 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name:     'Administrador',
      email:    data.email.toLowerCase().trim(),
      password: hashedPassword,
      role:     UserRole.ADMIN,
    });

    logger.info(`Novo administrador cadastrado: ${user.email} | ID: ${user.id}`);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async login(
    email:    string,
    password: string,
  ): Promise<{ token: string; user: Omit<UserAttributes, 'password'> }> {
    if (!isNotEmpty(email))    throw new AppError('E-mail é obrigatório', 400);
    if (!isNotEmpty(password)) throw new AppError('Senha é obrigatória', 400);

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('E-mail ou senha inválidos', 401);

    if (user.status === UserStatus.BLOCKED)
      throw new AppError('Usuário bloqueado. Entre em contato com o administrador.', 403);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new AppError('E-mail ou senha inválidos', 401);

    const signOptions: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      signOptions,
    );

    logger.info(`Login realizado: ${user.email} | Role: ${user.role}`);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return { token, user: userWithoutPassword };
  }

  async findById(id: number): Promise<Omit<UserAttributes, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async findAllUsers(): Promise<object[]> {
    return this.userRepository.findAll();
  }

  async findAllContributors(): Promise<object[]> {
    return this.userRepository.findAllContributors();
  }

  async findAllAdmins(): Promise<object[]> {
    return this.userRepository.findAllAdmins();
  }

  async blockUser(id: number, reason: string): Promise<void> {
    if (!isNotEmpty(reason)) throw new AppError('Motivo do bloqueio é obrigatório', 400);

    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    if (user.role === UserRole.SUPERADMIN || user.role === UserRole.ADMIN)
      throw new AppError('Administradores não podem ser bloqueados', 403);

    await this.userRepository.updateStatus(id, UserStatus.BLOCKED, reason);
    logger.info(`Usuário bloqueado: ID ${id} | Motivo: ${reason}`);
  }

  async updateProfile(id: number, data: ProfileUpdateData): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    const updateData: Partial<UserAttributes> = {};

    // Usa 'in' para verificar presença do campo sem depender de undefined
    if ('email' in data && data.email) {
      if (!isValidEmail(data.email)) throw new AppError('E-mail inválido', 400);
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists && emailExists.id !== id)
        throw new AppError('E-mail já cadastrado', 409);
      updateData.email = data.email.toLowerCase().trim();
    }

    if ('phone' in data && data.phone)
      updateData.phone = data.phone.replace(/\D/g, '');

    if ('zipCode' in data && data.zipCode)
      updateData.zipCode = data.zipCode.replace(/\D/g, '');

    if ('city' in data && data.city)
      updateData.city = data.city.trim();

    if ('state' in data && data.state)
      updateData.state = data.state.trim().toUpperCase();

    if ('newPassword' in data && data.newPassword) {
      if (!data.currentPassword)
        throw new AppError('Senha atual é obrigatória para alterar a senha', 400);

      const passwordMatch = await bcrypt.compare(data.currentPassword, user.password);
      if (!passwordMatch) throw new AppError('Senha atual incorreta', 400);

      if (data.newPassword !== data.confirmNewPassword)
        throw new AppError('As novas senhas não conferem', 400);

      this.validatePassword(data.newPassword);
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    await this.userRepository.updateProfile(id, updateData);
    logger.info(`Perfil atualizado: ID ${id}`);
  }

  async recoverPassword(data: {
    cpf:             string;
    newPassword:     string;
    confirmPassword: string;
  }): Promise<void> {
    if (!isNotEmpty(data.cpf))         throw new AppError('CPF é obrigatório', 400);
    if (!isNotEmpty(data.newPassword)) throw new AppError('Nova senha é obrigatória', 400);
    if (!isValidCPF(data.cpf))         throw new AppError('CPF inválido', 400);

    if (data.newPassword !== data.confirmPassword)
      throw new AppError('As senhas não conferem', 400);

    this.validatePassword(data.newPassword);

    const cleanedCpf = data.cpf.replace(/\D/g, '');
    const user = await this.userRepository.findByCPF(cleanedCpf);
    if (!user) throw new AppError('CPF não encontrado', 404);

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.updateProfile(user.id!, { password: hashedPassword });

    logger.info(`Senha recuperada via CPF: ${cleanedCpf}`);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    await this.userRepository.delete(id);
    logger.info(`Usuário removido: ID ${id}`);
  }
}

// Tipo do payload de atualização — string | null no lugar de string | undefined
interface ProfileUpdateData {
  email?:              string;
  phone?:              string;
  zipCode?:            string;
  city?:               string;
  state?:              string;
  currentPassword?:    string;
  newPassword?:        string;
  confirmNewPassword?: string;
}