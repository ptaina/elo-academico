import { Router } from 'express';
import { MagazineController } from './magazine.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/isAdmin.middleware';

const router = Router();
const magazineController = new MagazineController();

// Público — busca com filtros e detalhes
router.get('/', (req, res) => magazineController.search(req, res));
router.get('/:id', (req, res) => magazineController.findById(req, res));

// Admin — CRUD completo
router.post('/', authMiddleware, isAdmin, (req, res) => magazineController.create(req, res));
router.put('/:id', authMiddleware, isAdmin, (req, res) => magazineController.update(req, res));
router.delete('/:id', authMiddleware, isAdmin, (req, res) => magazineController.delete(req, res));

export default router;
