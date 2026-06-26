import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate }    from 'react-router-dom';
import { Input }          from '../../../components/Atoms/Input/Input';
import { Button }         from '../../../components/Atoms/Button/Button';
import { api }            from '../../../services/Api';
import styles             from './MagazineCreate.module.css';

const QUALIS_OPTIONS = ['A1','A2','A3','A4','B1','B2','B3','B4','C'];

const formatISSN = (v: string) =>
  v.replace(/\D/g,'').replace(/(\d{4})(\d)/,'$1-$2').slice(0,9);

export function MagazineCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    name: '', issn: '', officialLink: '', knowledgeArea: '',
    qualis: '', hasFee: 'false', description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    api.get<{ id: number; name: string }[]>('/categories').then(setCategories).catch(() => null);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const finalValue = name === 'issn' ? formatISSN(value) : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(''); setIsLoading(true);
    try {
      await api.post('/magazines', {
        name: form.name.trim(), issn: form.issn,
        officialLink: form.officialLink.trim(),
        knowledgeArea: form.knowledgeArea,
        qualis: form.qualis,
        hasFee: form.hasFee === 'true',
        description: form.description.trim() || undefined,
      });
      navigate('/admin/magazines');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar revista.');
    } finally { setIsLoading(false); }
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate('/admin/magazines')}>← Voltar</button>
      <h1 className={styles.title}>Nova Revista</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input label="Nome da Revista *" name="name" value={form.name} onChange={handleChange} required />
        <div className={styles.row}>
          <Input label="ISSN *" name="issn" value={form.issn} onChange={handleChange} maxLength={9} placeholder="0000-0000" required />
          <div className={styles.field}>
            <label className={styles.label}>Qualis *</label>
            <select name="qualis" className={styles.select} value={form.qualis} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {QUALIS_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Área do Conhecimento *</label>
            <select name="knowledgeArea" className={styles.select} value={form.knowledgeArea} onChange={handleChange} required>
              <option value="">Selecione uma área...</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Taxa de Publicação *</label>
            <select name="hasFee" className={styles.select} value={form.hasFee} onChange={handleChange}>
              <option value="false">Gratuita</option>
              <option value="true">Paga (possui taxa)</option>
            </select>
          </div>
        </div>
        <Input label="Link Oficial *" name="officialLink" type="url" value={form.officialLink} onChange={handleChange} placeholder="https://..." required />
        <div className={styles.field}>
          <label className={styles.label}>Descrição (opcional)</label>
          <textarea name="description" className={styles.textarea} value={form.description}
            onChange={handleChange} rows={3} placeholder="Descrição da revista..." />
        </div>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          Cadastrar Revista
        </Button>
      </form>
    </div>
  );
}
