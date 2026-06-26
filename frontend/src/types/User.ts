export type UserRole   = 'SUPERADMIN' | 'ADMIN' | 'CONTRIBUTOR';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf?: string | null;
  phone?: string | null;
  zipCode?: string | null;
  street?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  number?: string | null;
  complement?: string | null;
  role: UserRole;
  status?: UserStatus;
  banReason?: string | null;
}
