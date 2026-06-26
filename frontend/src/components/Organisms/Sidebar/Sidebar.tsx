import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileCheck, BookOpen, Tag, Users, LogOut, UserCircle, ShieldPlus,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Sidebar.module.css';

interface NavItem {
  path:   string;
  label:  string;
  icon:   React.ReactNode;
  end?:   boolean;
  onlySuper?: boolean;
}

const navItems: NavItem[] = [
  { path: '/admin',             label: 'Dashboard',     icon: <LayoutDashboard size={18} />, end: true },
  { path: '/admin/submissions', label: 'Sugestões',     icon: <FileCheck size={18} />,       end: true },
  { path: '/admin/magazines',   label: 'Revistas',      icon: <BookOpen size={18} />,        end: true },
  { path: '/admin/categories',  label: 'Categorias',    icon: <Tag size={18} />,             end: true },
  { path: '/admin/users',       label: 'Usuários',      icon: <Users size={18} />,           end: true },
  { path: '/admin/admins/create', label: 'Criar Admin', icon: <ShieldPlus size={18} />,     end: true, onlySuper: true },
];

export function Sidebar() {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandName}>Elo Acadêmico</span>
        <span className={styles.brandSub}>Painel Admin</span>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems
            .filter(item => !item.onlySuper || isSuperAdmin)
            .map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <UserCircle size={16} />
          <span className={styles.userName}>{user?.name?.split(' ')[0] ?? 'Admin'}</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Sair">
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
