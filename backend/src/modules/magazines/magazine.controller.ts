import { Request, Response } from 'express';
import { MagazineService } from './magazine.service';
import { MagazineRepository } from './magazine.repository';
import { AppError } from '../../shared/AppError';
import logger from '../../utils/logger';

const magazineService = new MagazineService(new MagazineRepository());

export class MagazineController {
  async search(req: Request, res: Response): Promise<void> {
    try {
      const { search, knowledgeArea, qualis, hasFee } = req.query;

      const filters = {
        search:        search as string | undefined,
        knowledgeArea: knowledgeArea as string | undefined,
        qualis:        qualis as string | undefined,
        hasFee:        hasFee !== undefined ? hasFee === 'true' : undefined,
      };

      const magazines = await magazineService.findAll(filters);
      res.json(magazines);
    } catch (error) {
      logger.error('Erro ao buscar revistas:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      const magazine = await magazineService.findById(id);
      if (!magazine) {
        res.status(404).json({ message: 'Revista não encontrada' });
        return;
      }
      res.json(magazine);
    } catch (error) {
      logger.error('Erro ao buscar revista:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const magazine = await magazineService.create(req.body);
      res.status(201).json({ message: 'Revista cadastrada com sucesso', magazine });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao cadastrar revista:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      await magazineService.update(id, req.body);
      const magazine = await magazineService.findById(id);
      res.json({ message: 'Revista atualizada com sucesso', magazine });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao atualizar revista:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      await magazineService.delete(id);
      res.json({ message: 'Revista removida com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao remover revista:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
