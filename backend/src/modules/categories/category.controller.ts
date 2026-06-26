import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { AppError } from '../../shared/AppError';
import logger from '../../utils/logger';

const categoryService = new CategoryService(new CategoryRepository());

export class CategoryController {
  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryService.findAll();
      res.json(categories);
    } catch (error) {
      logger.error('Erro ao listar categorias:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const category = await categoryService.create(name);
      res.status(201).json({ message: 'Categoria criada com sucesso', category });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao criar categoria:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      await categoryService.delete(id);
      res.json({ message: 'Categoria removida com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao remover categoria:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
