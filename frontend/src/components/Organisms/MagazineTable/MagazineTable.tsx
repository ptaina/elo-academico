import { useNavigate } from 'react-router-dom';
import { Badge }   from '../../Atoms/Badge/Badge';
import { Button }  from '../../Atoms/Button/Button';
import styles from './MagazineTable.module.css';

export interface Magazine {
  id: number;
  name: string;
  issn: string;
  area: string;
  qualis: string;
  description: string;
  officialLink: string;
  category: string;
  hasFee: boolean;
}

interface MagazineTableProps {
  magazines: Magazine[];
  onDelete: (magazine: Magazine) => void;
}

export function MagazineTable({ magazines, onDelete }: MagazineTableProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Nome</th>
            <th className={styles.th}>ISSN</th>
            <th className={styles.th}>Área</th>
            <th className={styles.th}>Qualis</th>
            <th className={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {magazines.map((magazine) => (
            <tr key={magazine.id} className={styles.tr}>
              <td className={styles.td}>
                <span className={styles.magazineName}>{magazine.name}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.cellMuted}>{magazine.issn}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.cellText}>{magazine.area}</span>
              </td>
              <td className={styles.td}>
                <Badge label={magazine.qualis} />
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <Button
                    variant="ghost"
                    className={styles.linkDetails}
                    size="sm"
                    onClick={() => navigate(`/admin/magazines/${magazine.id}`)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.linkDelete}
                    onClick={() => onDelete(magazine)}
                  >
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}