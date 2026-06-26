import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import { Badge }               from '../../components/Atoms/Badge/Badge';
import { Button }              from '../../components/Atoms/Button/Button';
import { useAuth }             from '../../context/AuthContext';
import { api }                 from '../../services/Api';
import type { Suggestion }     from '../../types/Suggestion';
import styles                  from './UserDashboard.module.css';

const STATUS_LABELS: Record<string, string> = {
  PENDING:  'Pendente',
  APPROVED: 'Aprovada',
  REJECTED: 'Recusada',
};

export function UserDashboard() {
  const { user }                      = useAuth();
  const navigate                      = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState('');
  const [activeTab, setActiveTab]     = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    api.get<Suggestion[]>('/suggestions/my')
      .then(setSuggestions)
      .catch(() => setError('Não foi possível carregar suas sugestões.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = activeTab === 'ALL'
    ? suggestions
    : suggestions.filter(s => s.status === activeTab);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Olá, {user?.name?.split(' ')[0]}</h1>
          <p className={styles.subtitle}>Acompanhe suas sugestões de revistas</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={() => navigate('/profile')}>
            Editar Perfil
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/search')}>
            Pesquisar Revistas
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/suggest-magazine')}>
            Nova Sugestão
          </Button>
        </div>
      </header>

      <section className={styles.tabs}>
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => (
          <button key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab === 'ALL' ? 'Todas' : STATUS_LABELS[tab]}
            {' '}
            <span className={styles.tabCount}>
              ({tab === 'ALL' ? suggestions.length : suggestions.filter(s => s.status === tab).length})
            </span>
          </button>
        ))}
      </section>

      <section className={styles.listSection}>
        {isLoading && <p className={styles.empty}>Carregando...</p>}
        {error && <p className={styles.empty}>{error}</p>}
        {!isLoading && !error && filtered.length === 0 && (
          <p className={styles.empty}>
            Nenhuma sugestão {activeTab !== 'ALL' ? STATUS_LABELS[activeTab]?.toLowerCase() : ''} encontrada.
          </p>
        )}
        {!isLoading && !error && filtered.map(s => (
          <article key={s.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>{s.name}</h3>
                <p className={styles.cardMeta}>{s.knowledgeArea} · ISSN: {s.issn}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Badge label={s.qualis} />
                <Badge label={STATUS_LABELS[s.status] ?? s.status} />
              </div>
            </div>
            {s.status === 'REJECTED' && s.rejectionReason && (
              <div className={styles.rejectionBox}>
                <strong>Motivo da recusa:</strong> {s.rejectionReason}
              </div>
            )}
            <a href={s.officialLink} target="_blank" rel="noopener noreferrer"
              className={styles.link}>
              Acessar revista ↗
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}