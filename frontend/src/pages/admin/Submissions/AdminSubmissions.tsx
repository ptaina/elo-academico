// frontend/src/pages/admin/Submissions/AdminSubmissions.tsx

import { useState, useEffect }  from 'react';
import { useNavigate }          from 'react-router-dom';
import { Badge }                from '../../../components/Atoms/Badge/Badge';
import { api }                  from '../../../services/Api';
import type { Suggestion }      from '../../../types/Suggestion';
import styles                   from './AdminSubmissions.module.css';

const STATUS_LABELS: Record<string, string> = {
  PENDING:  'Pendente',
  APPROVED: 'Aprovada',
  REJECTED: 'Recusada',
};

type FilterStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export function AdminSubmissions() {
  const navigate = useNavigate();

  const [suggestions, setSuggestions]       = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading]           = useState(true);
  const [error, setError]                   = useState('');
  const [filter, setFilter]                 = useState<FilterStatus>('ALL');
  const [selected, setSelected]             = useState<Suggestion | null>(null);
  const [rejectError, setRejectError]       = useState('');
  const [actionSuccess, setActionSuccess]   = useState('');

  const load = async (status: FilterStatus) => {
    setIsLoading(true); setError('');
    try {
      const url = status !== 'ALL' ? `/suggestions?status=${status}` : '/suggestions';
      setSuggestions(await api.get<Suggestion[]>(url));
    } catch {
      setError('Não foi possível carregar as sugestões.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(filter); }, [filter]);

  function openModal(s: Suggestion) {
    setSelected(s);
    setRejectError('');
    setActionSuccess('');
  }

  function closeModal() {
    setSelected(null);
    setRejectError('');
    setActionSuccess('');
  }

  async function handleApprove() {
    if (!selected) return;
    try {
      await api.patch(`/suggestions/${selected.id}/approve`, {});
      setSuggestions(prev => prev.map(s =>
        s.id === selected.id ? { ...s, status: 'APPROVED' } : s
      ));
      setSelected(prev => prev ? { ...prev, status: 'APPROVED' } : null);
      setActionSuccess('Sugestão aprovada com sucesso!');
    } catch (err) {
      setRejectError(err instanceof Error ? err.message : 'Erro ao aprovar.');
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Submissões para Revisão</h1>
      </header>

      <nav className={styles.tabs}>
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as FilterStatus[]).map(s => (
          <button key={s}
            className={`${styles.tab} ${filter === s ? styles.tabActive : ''}`}
            onClick={() => setFilter(s)}>
            {s === 'ALL' ? 'Todas' : STATUS_LABELS[s]}
          </button>
        ))}
      </nav>

      {isLoading && <p className={styles.empty}>Carregando...</p>}
      {error     && <p className={styles.empty}>{error}</p>}
      {!isLoading && !error && suggestions.length === 0 && (
        <p className={styles.empty}>Nenhuma submissão encontrada.</p>
      )}

      {!isLoading && !error && suggestions.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nome da Revista</th>
                <th className={styles.th}>Área</th>
                <th className={styles.th}>ISSN</th>
                <th className={styles.th}>Qualis</th>
                <th className={styles.th}>Data de Envio</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map(s => (
                <tr key={s.id} className={styles.tr}>
                  <td className={styles.td}>{s.name}</td>
                  <td className={styles.td}>{s.knowledgeArea}</td>
                  <td className={styles.td}>{s.issn}</td>
                  <td className={styles.td}><Badge label={s.qualis} /></td>
                  <td className={styles.td}>{s.createdAt ? formatDate(s.createdAt) : '-'}</td>
                  <td className={styles.td}>
                    <Badge label={STATUS_LABELS[s.status] ?? s.status} />
                  </td>
                  <td className={styles.td}>
                    <button className={styles.btnDetalhes} onClick={() => openModal(s)}>
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Detalhes da Submissão</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <span className={styles.modalLabel}>Nome da Revista</span>
                <span className={styles.modalValue}>{selected.name}</span>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>ISSN</span>
                  <span className={styles.modalValue}>{selected.issn}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Qualis</span>
                  <Badge label={selected.qualis} />
                </div>
              </div>

              {selected.description && (
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Descrição</span>
                  <span className={styles.modalValue}>{selected.description}</span>
                </div>
              )}

              <div className={styles.modalField}>
                <span className={styles.modalLabel}>Link Oficial</span>
                <a href={selected.officialLink} target="_blank" rel="noopener noreferrer"
                  className={styles.modalLink}>
                  {selected.officialLink}
                </a>
              </div>

              <div className={styles.modalField}>
                <span className={styles.modalLabel}>Categoria Sugerida</span>
                <span className={styles.modalValue}>{selected.knowledgeArea}</span>
              </div>

              <div className={styles.modalField}>
                <span className={styles.modalLabel}>O periódico possui taxa de publicação?</span>
                <Badge label={selected.hasFee ? 'Possui taxa' : 'Sem taxa'} />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Status</span>
                  <Badge label={STATUS_LABELS[selected.status] ?? selected.status} />
                </div>
                {selected.createdAt && (
                  <div className={styles.modalField}>
                    <span className={styles.modalLabel}>Data de Envio</span>
                    <span className={styles.modalValue}>{formatDate(selected.createdAt)}</span>
                  </div>
                )}
              </div>

              {selected.rejectionReason && (
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Motivo da Recusa</span>
                  <span className={styles.modalRejected}>{selected.rejectionReason}</span>
                </div>
              )}

              {actionSuccess && <p className={styles.successMsg}>{actionSuccess}</p>}
              {rejectError   && <p className={styles.rejectError}>{rejectError}</p>}
            </div>

            <div className={styles.modalFooter}>
              {selected.status === 'PENDING' && !actionSuccess && (
                <>
                  <button className={styles.btnAprovar} onClick={() => void handleApprove()}>
                    Aprovar
                  </button>
                  <button className={styles.btnRejeitar}
                    onClick={() => { closeModal(); navigate(`/admin/submissions/${selected.id}`); }}>
                    Recusar
                  </button>
                </>
              )}
              <button className={styles.btnFechar} onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}