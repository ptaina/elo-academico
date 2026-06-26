import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const role = req.user?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
    res.status(403).json({ message: 'Acesso restrito a administradores' });
    return;
  }
  next();
}
