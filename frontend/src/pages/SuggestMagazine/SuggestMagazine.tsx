import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { Button }              from '../../components/Atoms/Button/Button';
import { useAuth }             from '../../context/AuthContext';
import { api }                 from '../../services/Api';
import styles                  from './SuggestMagazine.module.css';

interface SuggestForm {
  name:          string;
  issn:          string;
  knowledgeArea: string;
  officialLink:  string;
  qualis:        string;
  hasFee:        string;
  description:   string;
}

const QUALIS_OPTIONS = ['A1','A2','A3','A4','B1','B2','B3','B4','C'];

const EMPTY_FORM: SuggestForm = {
  name: '', issn: '', knowledgeArea: '', officialLink: '',
  qualis: '', hasFee: 'false', description: '',
};

const formatISSN = (v: string) =>
  v.replace(/\D/g,'').replace(/(\d{4})(\d)/,'$1-$2').slice(0,9);

export function SuggestMagazine() {
  const { isAuthenticated } = useAuth();
  const navigate            = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm]             = useState<SuggestForm>(EMPTY_FORM);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    api.get<{ id: number; name: string }[]>('/categories')
      .then(setCategories)
      .catch(() => null);
  }, [isAuthenticated, navigate]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const finalValue = name === 'issn' ? formatISSN(value) : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
  }

  async function handleSubmit() {
    if (isLoading) return;
    if (!form.name.trim() || !form.issn || !form.officialLink.trim() ||
        !form.knowledgeArea || !form.qualis) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      await api.post('/suggestions', {
        name:          form.name.trim(),
        issn:          form.issn,
        officialLink:  form.officialLink.trim(),
        knowledgeArea: form.knowledgeArea,
        qualis:        form.qualis,
        hasFee:        form.hasFee === 'true',
        description:   form.description.trim() || undefined,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar sugestão.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successWrapper}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 52 52" fill="none" className={styles.checkSvg}>
                <circle cx="26" cy="26" r="25" stroke="#16a34a" strokeWidth="2" fill="#f0fdf4" />
                <path d="M15 26.5L22 33.5L37 18.5" stroke="#16a34a" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Sugestão enviada com sucesso!</h2>
            <p className={styles.successText}>
              Nossa equipe fará a análise. Você pode acompanhar o status no seu perfil.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="secondary" size="md" onClick={() => { setForm(EMPTY_FORM); setIsSubmitted(false); }}>
                Enviar outra sugestão
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
                Ver minhas sugestões
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
  <button
    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem', padding: '0', marginBottom: '0.75rem', display: 'block' }}
    onClick={() => navigate(-1)}
  >
    ← Voltar
  </button>
  <h1 className={styles.title}>Sugerir Nova Revista</h1>
  <p className={styles.subtitle}>
    Conhece uma revista que deveria estar no acervo? Envie os dados para análise.
  </p>
</div>
        <div className={styles.divider} />
        {error && <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

        <div className={styles.form}>
          <div className={styles.inputBlock}>
            <label className={styles.inputLabel} htmlFor="name">
              Nome da Revista <span className={styles.required}>*</span>
            </label>
            <input id="name" name="name" className={styles.input}
              value={form.name} onChange={handleChange} placeholder="Ex: Revista Brasileira de Computação" />
          </div>

          <div className={styles.row}>
            <div className={styles.inputBlock}>
              <label className={styles.inputLabel} htmlFor="issn">
                ISSN <span className={styles.required}>*</span>
              </label>
              <input id="issn" name="issn" className={styles.input}
                value={form.issn} onChange={handleChange} placeholder="0000-0000" maxLength={9} />
            </div>
            <div className={styles.inputBlock}>
              <label className={styles.inputLabel} htmlFor="qualis">
                Qualis <span className={styles.required}>*</span>
              </label>
              <select id="qualis" name="qualis" className={styles.select}
                value={form.qualis} onChange={handleChange}>
                <option value="">Selecione...</option>
                {QUALIS_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputBlock}>
              <label className={styles.inputLabel} htmlFor="knowledgeArea">
                Área do Conhecimento <span className={styles.required}>*</span>
              </label>
              <select id="knowledgeArea" name="knowledgeArea" className={styles.select}
                value={form.knowledgeArea} onChange={handleChange}>
                <option value="">Selecione uma área...</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.inputBlock}>
              <label className={styles.inputLabel} htmlFor="hasFee">
                Possui Taxa? <span className={styles.required}>*</span>
              </label>
              <select id="hasFee" name="hasFee" className={styles.select}
                value={form.hasFee} onChange={handleChange}>
                <option value="false">Gratuita</option>
                <option value="true">Paga (possui taxa)</option>
              </select>
            </div>
          </div>

          <div className={styles.inputBlock}>
            <label className={styles.inputLabel} htmlFor="officialLink">
              Link Oficial <span className={styles.required}>*</span>
            </label>
            <input id="officialLink" name="officialLink" type="url" className={styles.input}
              value={form.officialLink} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className={styles.inputBlock}>
            <label className={styles.inputLabel} htmlFor="description">
              Descrição <span className={styles.optional}>(opcional)</span>
            </label>
            <textarea id="description" name="description" className={styles.textarea}
              value={form.description} onChange={handleChange} rows={3}
              placeholder="Breve descrição da revista..." />
          </div>

          <div className={styles.submitWrapper}>
            <Button variant="primary" size="md" onClick={() => void handleSubmit()}
              disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Sugestão'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
