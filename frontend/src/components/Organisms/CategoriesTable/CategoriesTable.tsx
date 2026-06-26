import { Button } from '../../Atoms/Button/Button';
import styles from './CategoriesTable.module.css';

export interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoriesTableProps {
  categories: Category[];
  onDelete: (category: Category) => void;
}

export function CategoriesTable({ categories, onDelete }: CategoriesTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Nome</th>
            <th className={styles.th}>Descrição</th>
            <th className={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className={styles.tr}>
              <td className={styles.td}>
                <span className={styles.categoryName}>{category.name}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.categoryDescription}>{category.description}</span>
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <div className={styles.linkDelete}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(category)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories.length === 0 && (
        <p className={styles.emptyState}>Nenhuma categoria encontrada.</p>
      )}
    </div>
  );
}