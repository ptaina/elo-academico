import { Badge } from '../../Atoms/Badge/Badge';
import { Button } from '../../Atoms/Button/Button';
import type { QualisEstrato } from '../../../types/Magazine';
import styles from './cardMagazine.module.css';

export type { QualisEstrato };

interface CardMagazineProps {
  id:            number;
  name:          string;
  knowledgeArea: string;
  qualis:        QualisEstrato;
  hasFee:        boolean;
  officialLink:  string;
}

export function CardMagazine({ id, name, knowledgeArea, qualis, hasFee, officialLink }: CardMagazineProps) {
  return (
    <article className={styles.card} data-testid={`card-magazine-${id}`}>
      <div className={styles.header}>
        <Badge label={qualis} />
        <Badge label={hasFee ? 'Paga' : 'Gratuita'} />
      </div>
      <h3 className={styles.nome}>{name}</h3>
      <p className={styles.area}>{knowledgeArea}</p>
      <Button
        variant="secondary"
        size="sm"
        testId={`btn-acessar-${id}`}
        onClick={() => window.open(officialLink, '_blank', 'noopener,noreferrer')}
      >
        Acessar Site Oficial ↗
      </Button>
    </article>
  );
}
