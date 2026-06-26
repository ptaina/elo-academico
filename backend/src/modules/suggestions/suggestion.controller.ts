// backend/src/modules/suggestions/suggestion.controller.ts
//
// MUDANÇA: SuggestionService agora recebe MagazineRepository
// como segundo argumento (injeção de dependência).

import { Request, Response }    from 'express';
import { SuggestionService }    from './suggestion.service';
import { SuggestionRepository } from './suggestion.repository';
import { MagazineRepository }   from '../magazines/magazine.repository';
import { AuthRequest }          from '../../middlewares/auth.middleware';
import { AppError }             from '../../shared/AppError';
import logger                   from '../../utils/logger';

const suggestionService = new SuggestionService(
  new SuggestionRepository(),
  new MagazineRepository(),
);

export class SuggestionController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const contributorId = req.user?.id;
      if (!contributorId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      const description: string | null =
        typeof req.body.description === 'string' && req.body.description.trim()
          ? req.body.description.trim()
          : null;

      const suggestion = await suggestionService.create({
        ...req.body,
        description,
        contributorId,
      });
      res.status(201).json({ message: 'Sugestão enviada com sucesso', suggestion });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao criar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findMySuggestions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const contributorId = req.user?.id;
      if (!contributorId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }
      const suggestions = await suggestionService.findByContributor(contributorId);
      res.json(suggestions);
    } catch (error) {
      logger.error('Erro ao buscar sugestões:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const status = typeof req.query['status'] === 'string' ? req.query['status'] : '';
      const suggestions = await suggestionService.findAll(status);
      res.json(suggestions);
    } catch (error) {
      logger.error('Erro ao listar sugestões:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      const suggestion = await suggestionService.findById(id);
      if (!suggestion) {
        res.status(404).json({ message: 'Sugestão não encontrada' });
        return;
      }
      res.json(suggestion);
    } catch (error) {
      logger.error('Erro ao buscar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async approve(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      await suggestionService.approve(id);
      res.json({ message: 'Sugestão aprovada e revista cadastrada com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao aprovar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async reject(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id']!, 10);
      const { reason } = req.body;
      await suggestionService.reject(id, reason);
      res.json({ message: 'Sugestão recusada com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      logger.error('Erro ao recusar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}