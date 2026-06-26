import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Atoms/Button/Button';
import styles from './NotFound.module.css';

export function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => navigate('/');

  return (
    <div className={styles.wrapper} data-testid="page-not-found">
      <span className={styles.errorCode} aria-hidden="true">404</span>

      <div className={styles.content}>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.description}>
          O conteúdo que você está procurando não existe, foi removido ou está
          temporariamente indisponível.
        </p>
        <Button
          testId="btn-go-home"
          variant="primary"
          size="md"
          onClick={handleGoHome}
        >
          Voltar para a Busca
        </Button>
      </div>
    </div>
  );
}