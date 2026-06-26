import { Modal } from '../../Atoms/Modal/Modal';
import { Badge } from '../../Atoms/Badge/Badge';
import { Button } from '../../Atoms/Button/Button';
import type { Magazine } from '../MagazineTable/MagazineTable';

import styles from './MagazineDetailsModal.module.css';

interface MagazineDetailsModalProps {
  magazine: Magazine | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function MagazineDetailsModal({
  magazine,
  isOpen,
  onClose,
  onEdit,
}: MagazineDetailsModalProps) {
  if (!magazine) return null;

  return (
    <Modal isOpen={isOpen} title="Detalhes da Revista" onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Nome da Revista</span>
          <span className={styles.fieldValue}>{magazine.name}</span>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>ISSN</span>
            <span className={styles.fieldValue}>{magazine.issn}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Qualis</span>
            <Badge label={magazine.qualis} />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Descrição</span>
          <p className={styles.fieldDescription}>{magazine.description}</p>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Link Oficial</span>
          <a
            href={magazine.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fieldLink}
          >
            {magazine.officialLink}
          </a>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Categoria</span>
          <span className={styles.fieldValue}>{magazine.category}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>O periódico possui taxa de publicação?</span>
          <Badge label={magazine.hasFee ? 'Possui taxa' : 'Sem taxa'} />
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.editBtn} onClick={onEdit}>
          ✏ Editar
        </button>
        <Button variant="primary" size="md" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  );
}