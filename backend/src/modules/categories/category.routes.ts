import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/isAdmin.middleware';

const router = Router();
const categoryController = new CategoryController();

// Público — visitantes e contribuidores precisam listar para filtros e formulários
router.get('/', (req, res) => categoryController.findAll(req, res));

// Apenas admin pode criar e deletar
router.post('/', authMiddleware, isAdmin, (req, res) => categoryController.create(req, res));
router.delete('/:id', authMiddleware, isAdmin, (req, res) => categoryController.delete(req, res));

export default router;
