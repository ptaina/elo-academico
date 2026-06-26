import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function isSuperAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'SUPERADMIN') {
    res.status(403).json({ message: 'Acesso restrito ao administrador principal' });
    return;
  }
  next();
}
