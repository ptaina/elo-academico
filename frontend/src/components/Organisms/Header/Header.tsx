// frontend/src/components/Organisms/Header/Header.tsx

import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';

function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]!.toUpperCase())
    .join('');
}

export function Header() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(
    location.pathname
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleLogout(): void {
    logout();
    navigate('/');
  }

  function handleSuggest(): void {
    if (isAuthenticated) {
      navigate('/suggest-magazine');
    } else {
      navigate('/login', { state: { redirectTo: '/suggest-magazine' } });
    }
  }

  function handleGoToPanel(): void {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}
      role="banner"
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Elo Acadêmico — Página Inicial">
          <span className={styles.logoIcon} aria-hidden="true">
            <BookOpen size={20} strokeWidth={2} />
          </span>
          <span className={styles.logoText}>
            Elo<span className={styles.logoAccent}> Acadêmico</span>
          </span>
        </Link>

        {!isAuthPage && (
          <div className={styles.actions}>
            {isAuthenticated && user ? (
              <>
                {/* Sugerir Revista apenas para contribuidores logados */}
                {!isAdmin && (
                  <button className={styles.suggestButton} onClick={handleSuggest}>
                    Sugerir Revista
                  </button>
                )}

                {/* Ir para o painel */}
                <button className={styles.panelButton} onClick={handleGoToPanel}>
                  Ir para o Painel
                </button>

                {/* Avatar e nome */}
                <div className={styles.userArea}>
                  <div className={styles.avatar} aria-hidden="true">
                    {getInitials(user.name)}
                  </div>
                  <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                </div>

                <button
                  type="button"
                  className={styles.logoutButton}
                  onClick={handleLogout}
                  aria-label="Sair da conta"
                  title="Sair"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                {/* Search: Sugerir Revista. Demais páginas: Criar Conta */}
                {location.pathname === '/search' ? (
                  <button className={styles.suggestButton} onClick={handleSuggest}>
                    Sugerir Revista
                  </button>
                ) : (
                  <Link to="/register" className={styles.buttonSecondary}>
                    Criar Conta
                  </Link>
                )}
                <Link to="/login" className={styles.buttonPrimary}>
                  Entrar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;