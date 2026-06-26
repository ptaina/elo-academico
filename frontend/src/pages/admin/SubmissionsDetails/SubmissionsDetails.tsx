import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button }               from '../../../components/Atoms/Button/Button';
import { Badge }                from '../../../components/Atoms/Badge/Badge';
import { api }                  from '../../../services/Api';
import type { Suggestion }      from '../../../types/Suggestion';
import styles                   from './SubmissionsDetails.module.css';

export function SubmissionsDetailsPage() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [reason, setReason]         = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<Suggestion>(`/suggestions/${id}`)
      .then(setSuggestion)
      .catch(() => setError('Sugestão não encontrada.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleApprove() {
    if (!id) return;
    setError(''); setSuccess('');
    try {
      await api.patch(`/suggestions/${id}/approve`, {});
      setSuccess('Sugestão aprovada com sucesso!');
      setSuggestion(prev => prev ? { ...prev, status: 'APPROVED' } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aprovar.');
    }
  }

  async function handleReject() {
    if (!id || !reason.trim()) { setError('O motivo da recusa é obrigatório.'); return; }
    setError(''); setSuccess('');
    try {
      await api.patch(`/suggestions/${id}/reject`, { reason });
      setSuccess('Sugestão recusada.');
      setSuggestion(prev => prev ? { ...prev, status: 'REJECTED', rejectionReason: reason } : null);
      setShowRejectForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recusar.');
    }
  }

  if (isLoading) return <div className={styles.container}><p>Carregando...</p></div>;

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate('/admin/submissions')}>← Voltar</button>

      {error   && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {suggestion && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.name}>{suggestion.name}</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Badge label={suggestion.qualis} />
              <Badge label={suggestion.hasFee ? 'Paga' : 'Gratuita'} />
              <Badge label={{ PENDING: 'Pendente', APPROVED: 'Aprovada', REJECTED: 'Recusada' }[suggestion.status] ?? suggestion.status} />
            </div>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}><span className={styles.label}>ISSN</span><span>{suggestion.issn}</span></div>
            <div className={styles.field}><span className={styles.label}>Área</span><span>{suggestion.knowledgeArea}</span></div>
            <div className={styles.field}>
              <span className={styles.label}>Link Oficial</span>
              <a href={suggestion.officialLink} target="_blank" rel="noopener noreferrer" className={styles.link}>{suggestion.officialLink}</a>
            </div>
            {suggestion.description && (
              <div className={styles.field}><span className={styles.label}>Descrição</span><span>{suggestion.description}</span></div>
            )}
            {suggestion.rejectionReason && (
              <div className={styles.field}>
                <span className={styles.label}>Motivo da Recusa</span>
                <span className={styles.rejected}>{suggestion.rejectionReason}</span>
              </div>
            )}
          </div>

          {suggestion.status === 'PENDING' && (
            <div className={styles.actions}>
              {!showRejectForm ? (
                <>
                  <Button variant="primary" onClick={() => void handleApprove()}>Aprovar</Button>
                  <Button variant="danger" onClick={() => setShowRejectForm(true)}>Recusar</Button>
                </>
              ) : (
                <div className={styles.rejectForm}>
                  <label className={styles.rejectLabel}>Motivo da Recusa <span style={{ color: '#dc2626' }}>*</span></label>
                  <textarea className={styles.rejectTextarea} rows={3} value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Descreva o motivo da recusa..." />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button variant="danger" onClick={() => void handleReject()}>Confirmar Recusa</Button>
                    <Button variant="secondary" onClick={() => { setShowRejectForm(false); setReason(''); }}>Cancelar</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
