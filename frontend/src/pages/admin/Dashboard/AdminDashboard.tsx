import { useNavigate }   from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button }        from '../../../components/Atoms/Button/Button';
import { api }           from '../../../services/Api';
import styles            from './AdminDashboard.module.css';
import type { Suggestion } from '../../../types/Suggestion';

interface StatCard { id: number; value: string; label: string; icon?: string; }

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: 'Pendente',  cls: 'badgePendente'  },
  APPROVED: { label: 'Aprovada',  cls: 'badgeAprovado'  },
  REJECTED: { label: 'Recusada',  cls: 'badgeRejeitado' },
};

// Ícones SVG monocromáticos — mapeados pelo id do card retornado pela API
function StatIcon({ id }: { id: number }) {
  const stroke = '#0A2540';
  const props  = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (id === 1) return (
    // Revistas cadastradas — livro
    <svg {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );

  if (id === 2) return (
    // Sugestões pendentes — clipboard
    <svg {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );

  // Contribuidores — usuários
  return (
    <svg {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [statCards, setStatCards]      = useState<StatCard[]>([]);
  const [recentSuggestions, setRecent] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading]      = useState(true);
  const [error, setError]              = useState('');

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const [stats, suggestions] = await Promise.all([
          api.get<StatCard[]>('/admin/stats'),
          api.get<Suggestion[]>('/suggestions?status=PENDING'),
        ]);
        setStatCards(stats);
        setRecent(suggestions.slice(0, 5));
      } catch {
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  if (isLoading) return <div className={styles.container}><p className={styles.pageTitle}>Carregando...</p></div>;
  if (error)     return <div className={styles.container}><p className={styles.pageTitle}>{error}</p></div>;

  return (
    <div className={styles.container}>
      <header className={styles.topbar}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
      </header>

      <section className={styles.statsGrid}>
        {statCards.map(card => (
          <div key={card.id} className={styles.statCard}>
            <span className={styles.statIcon}><StatIcon id={card.id} /></span>
            <span className={styles.statValue}>{card.value}</span>
            <span className={styles.statLabel}>{card.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
        <div className={styles.actionsRow}>
          <Button variant="primary" onClick={() => navigate('/admin/submissions')}>Revisar Sugestões</Button>
          <Button variant="primary" onClick={() => navigate('/admin/magazines/create')}>Cadastrar Revista</Button>
          <Button variant="primary" onClick={() => navigate('/admin/categories')}>Gerenciar Categorias</Button>
        </div>
      </section>

      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Sugestões Pendentes</h2>
        {recentSuggestions.length === 0 ? (
          <p style={{ color: '#64748b', padding: '1rem 0' }}>Nenhuma sugestão pendente.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Revista</th>
                  <th className={styles.th}>ISSN</th>
                  <th className={styles.th}>Área</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {recentSuggestions.map(s => {
                  const st = STATUS_MAP[s.status] ?? { label: s.status, cls: '' };
                  return (
                    <tr key={s.id} className={styles.tr}>
                      <td className={styles.td}>{s.name}</td>
                      <td className={styles.td}>{s.issn}</td>
                      <td className={styles.td}>{s.knowledgeArea}</td>
                      <td className={styles.td}>
                        <span className={`${styles.badge} ${styles[st.cls] ?? ''}`}>{st.label}</span>
                      </td>
                      <td className={styles.td}>
                        <button className={styles.detailsButton}
                          onClick={() => navigate(`/admin/submissions/${s.id}`)}>
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}