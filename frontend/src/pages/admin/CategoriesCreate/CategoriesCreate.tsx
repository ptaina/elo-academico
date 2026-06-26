import { useState, type FormEvent } from 'react';
import { useNavigate }              from 'react-router-dom';
import { Input }                    from '../../../components/Atoms/Input/Input';
import { Button }                   from '../../../components/Atoms/Button/Button';
import { api }                      from '../../../services/Api';
import styles                       from './CategoriesCreate.module.css';

export function CategoriesCreate() {
  const navigate = useNavigate();
  const [name, setName]           = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(''); setIsLoading(true);
    try {
      await api.post('/categories', { name: name.trim() });
      navigate('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria.');
    } finally { setIsLoading(false); }
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate('/admin/categories')}>← Voltar</button>
      <h1 className={styles.title}>Nova Área do Conhecimento</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input label="Nome da Categoria *" name="name" value={name}
          onChange={e => setName(e.target.value)} placeholder="Ex: Ciências da Computação" required />
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          Criar Categoria
        </Button>
      </form>
    </div>
  );
}
