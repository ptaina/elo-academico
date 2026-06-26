import { Modal } from '../../Atoms/Modal/Modal';
import { Badge } from '../../Atoms/Badge/Badge';
import { Button } from '../../Atoms/Button/Button';
import styles from './UserDetailsModal.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  registeredAt: string;
  totalSubmissions: number;
}

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} title="Detalhes do Usuário" onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Nome</span>
          <span className={styles.fieldValue}>{user.name}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <span className={styles.fieldValue}>{user.email}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Status</span>
          <Badge label={user.status} />
        </div>

        <div className={styles.metaRow}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Data de Cadastro</span>
            <span className={styles.fieldValue}>{user.registeredAt}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Submissões</span>
            <span className={styles.fieldValue}>{user.totalSubmissions}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="primary" size="md" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  );
}