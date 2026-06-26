import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate }              from 'react-router-dom';
import { Input }    from '../../../components/Atoms/Input/Input';
import { Button }   from '../../../components/Atoms/Button/Button';
import { api }      from '../../../services/Api';
import type { Magazine } from '../../../types/Magazine';
import styles       from './MagazinesDetails.module.css';

const QUALIS_OPTIONS = ['A1','A2','A3','A4','B1','B2','B3','B4','C'];

const formatISSN = (v: string) =>
  v.replace(/\D/g,'').replace(/(\d{4})(\d)/,'$1-$2').slice(0,9);

export function MagazineDetails() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm]     = useState({ name:'', issn:'', officialLink:'', knowledgeArea:'', qualis:'', hasFee:'false', description:'' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving]   = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<Magazine>(`/magazines/${id}`),
      api.get<{ id: number; name: string }[]>('/categories'),
    ]).then(([mag, cats]) => {
      setMagazine(mag);
      setCategories(cats);
      setForm({
        name: mag.name, issn: mag.issn, officialLink: mag.officialLink,
        knowledgeArea: mag.knowledgeArea, qualis: mag.qualis,
        hasFee: String(mag.hasFee),
        description: mag.description ?? '',
      });
    }).catch(() => setError('Revista não encontrada.'))
    .finally(() => setIsLoading(false));
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const finalValue = name === 'issn' ? formatISSN(value) : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(''); setSuccess(''); setIsSaving(true);
    try {
      await api.put(`/magazines/${id}`, {
        ...form, hasFee: form.hasFee === 'true',
        description: form.description || undefined,
      });
      setSuccess('Revista atualizada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar.');
    } finally { setIsSaving(false); }
  }

  if (isLoading) return <div className={styles.container}><p>Carregando...</p></div>;

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate('/admin/magazines')}>← Voltar</button>
      <h1 className={styles.title}>{magazine?.name ?? 'Editar Revista'}</h1>
      {error   && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input label="Nome *" name="name" value={form.name} onChange={handleChange} required />
        <div className={styles.row}>
          <Input label="ISSN *" name="issn" value={form.issn} onChange={handleChange} maxLength={9} required />
          <div className={styles.field}>
            <label className={styles.label}>Qualis *</label>
            <select name="qualis" className={styles.select} value={form.qualis} onChange={handleChange} required>
              {QUALIS_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Área do Conhecimento *</label>
            <select name="knowledgeArea" className={styles.select} value={form.knowledgeArea} onChange={handleChange} required>
              <option value="">Selecione...</option>
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
        <Input label="Link Oficial *" name="officialLink" type="url" value={form.officialLink} onChange={handleChange} required />
        <div className={styles.field}>
          <label className={styles.label}>Descrição (opcional)</label>
          <textarea name="description" className={styles.textarea} value={form.description}
            onChange={handleChange} rows={3} />
        </div>
        <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving}>
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
}
