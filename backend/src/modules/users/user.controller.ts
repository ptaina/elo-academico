import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { AppError } from '../../shared/AppError';
import logger from '../../utils/logger';

const userService = new UserService(new UserRepository());

export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.registerContributor(req.body);
      res.status(201).json({ message: 'Conta criada com sucesso', user });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json({ message: 'Login realizado com sucesso', ...result });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as Request & { user?: { id: number } }).user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }
      const user = await userService.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Erro ao buscar perfil:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as Request & { user?: { id: number } }).user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }
      await userService.updateProfile(userId, req.body);
      const user = await userService.findById(userId);
      res.json({ message: 'Perfil atualizado com sucesso', user });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async deleteMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as Request & { user?: { id: number } }).user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }
      await userService.deleteUser(userId);
      res.json({ message: 'Conta excluída com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao excluir conta:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async recoverPassword(req: Request, res: Response): Promise<void> {
    try {
      await userService.recoverPassword(req.body);
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao recuperar senha:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAllUsers();
      res.json(users);
    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findAllContributors(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAllContributors();
      res.json(users);
    } catch (error) {
      logger.error('Erro ao listar contribuidores:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findAllAdmins(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAllAdmins();
      res.json(users);
    } catch (error) {
      logger.error('Erro ao listar admins:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      const user = await userService.findById(id);
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      const { reason } = req.body;
      await userService.blockUser(id, reason);
      res.json({ message: 'Usuário bloqueado com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao bloquear usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.createAdmin(req.body);
      res.status(201).json({ message: 'Administrador criado com sucesso', user });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao criar admin:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
