import { Router } from 'express';
import { SuggestionController } from './suggestion.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/isAdmin.middleware';

const router = Router();
const suggestionController = new SuggestionController();

// Contribuidor — precisa estar autenticado
router.post('/', authMiddleware, (req, res) => suggestionController.create(req, res));
router.get('/my', authMiddleware, (req, res) => suggestionController.findMySuggestions(req, res));

// Admin — listagem e ações
router.get('/', authMiddleware, isAdmin, (req, res) => suggestionController.findAll(req, res));
router.get('/:id', authMiddleware, isAdmin, (req, res) => suggestionController.findById(req, res));
router.patch('/:id/approve', authMiddleware, isAdmin, (req, res) => suggestionController.approve(req, res));
router.patch('/:id/reject', authMiddleware, isAdmin, (req, res) => suggestionController.reject(req, res));

export default router;
