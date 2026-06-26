// frontend/src/pages/Login/Login.tsx

import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation }       from 'react-router-dom';
import { Input }                                from '../../components/Atoms/Input/Input';
import { Button }                               from '../../components/Atoms/Button/Button';
import { useAuth }                              from '../../context/AuthContext';
import styles                                   from './Login.module.css';

export function Login() {
  const { login, user, isLoading: authLoading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Destino após login — vem do state de navegação ou padrão por role
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;

  useEffect(() => {
    if (!authLoading && user) {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, authLoading, navigate, redirectTo]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <h1 className={styles.logoTitle}>Elo Acadêmico</h1>
          <p className={styles.logoSubtitle}>
            Plataforma de pesquisa de periódicos científicos com classificação Qualis
          </p>
        </div>
      </section>

      <main className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <header className={styles.formHeader}>
            <h2 className={styles.formTitle}>Entrar na plataforma</h2>
            <p className={styles.formSubtitle}>Insira seus dados de acesso</p>
          </header>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <Input
              label="E-mail" name="email" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" required
            />
            <Input
              label="Senha" name="password" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
            />
            <Link to="/forgot-password" className={styles.forgotLink}>
              Esqueceu sua senha?
            </Link>
            <Button
              type="submit" variant="primary"
              isLoading={isLoading} disabled={isLoading}
              className={styles.submitButton}
            >
              Entrar →
            </Button>
          </form>

          <footer className={styles.formFooter}>
            <p className={styles.loginRedirect}>
              Não tem conta?{' '}
              <Link to="/register" className={styles.footerLinkBold}>Criar conta</Link>
            </p>
            <Link to="/" className={styles.backHomeLink}>
              ← Página inicial
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}