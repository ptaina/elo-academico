import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/isAdmin.middleware';
import { isSuperAdmin } from '../../middlewares/isSuperAdmin.middleware';

const router = Router();
const userController = new UserController();

// Rotas públicas
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/recover-password', (req, res) => userController.recoverPassword(req, res));

// Rotas autenticadas — perfil próprio
router.get('/me', authMiddleware, (req, res) => userController.me(req, res));
router.patch('/me', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.delete('/me', authMiddleware, (req, res) => userController.deleteMe(req, res));

// Criação de admin — exclusivo do superadmin
router.post('/admin', authMiddleware, isSuperAdmin, (req, res) => userController.createAdmin(req, res));

// Listagens — admin
router.get('/', authMiddleware, isAdmin, (req, res) => userController.findAll(req, res));
router.get('/contributors', authMiddleware, isAdmin, (req, res) => userController.findAllContributors(req, res));
router.get('/admins', authMiddleware, isAdmin, (req, res) => userController.findAllAdmins(req, res));
router.get('/:id', authMiddleware, isAdmin, (req, res) => userController.findById(req, res));

// Ações admin
router.patch('/:id/block', authMiddleware, isAdmin, (req, res) => userController.blockUser(req, res));

export default router;
