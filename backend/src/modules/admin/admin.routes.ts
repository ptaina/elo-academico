import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/isAdmin.middleware';
import { MagazineRepository } from '../magazines/magazine.repository';
import { SuggestionRepository } from '../suggestions/suggestion.repository';
import { UserRepository } from '../users/user.repository';
import logger from '../../utils/logger';

const router = Router();

const magazineRepository  = new MagazineRepository();
const suggestionRepository = new SuggestionRepository();
const userRepository       = new UserRepository();

// Endpoint de estatísticas do dashboard administrativo
router.get('/stats', authMiddleware, isAdmin, async (_req: Request, res: Response) => {
  try {
    const [magazines, pendingSuggestions, contributors] = await Promise.all([
      magazineRepository.count(),
      suggestionRepository.countPending(),
      userRepository.findAllContributors(),
    ]);

    const stats = [
      { id: 1, value: String(magazines),         label: 'Revistas Cadastradas' },
      { id: 2, value: String(pendingSuggestions), label: 'Sugestões Pendentes' },
      { id: 3, value: String(contributors.length), label: 'Contribuidores' },
    ];

    res.json(stats);
  } catch (error) {
    logger.error('Erro ao buscar stats do dashboard:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
