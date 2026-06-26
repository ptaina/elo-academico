import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { Button }              from '../../../components/Atoms/Button/Button';
import { api }                 from '../../../services/Api';
import styles                  from './AdminCategories.module.css';

interface Category { id: number; name: string; }

export function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    api.get<Category[]>('/categories')
      .then(setCategories)
      .catch(() => setError('Erro ao carregar categorias.'))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Excluir a categoria "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Áreas do Conhecimento</h1>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/categories/create')}>
          Nova Categoria
        </Button>
      </header>

      {isLoading && <p className={styles.empty}>Carregando...</p>}
      {error     && <p className={styles.empty}>{error}</p>}
      {!isLoading && !error && categories.length === 0 && <p className={styles.empty}>Nenhuma categoria cadastrada.</p>}

      {!isLoading && !error && categories.length > 0 && (
        <div className={styles.list}>
          {categories.map(c => (
            <div key={c.id} className={styles.item}>
              <span className={styles.itemName}>{c.name}</span>
              <Button variant="danger" size="sm" onClick={() => void handleDelete(c.id, c.name)}>
                Excluir
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
