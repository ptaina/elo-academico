// frontend/src/pages/admin/Magazines/AdminMagazines.tsx
//
// MUDANÇA: botão "Detalhes" abre modal com todas as informações.
// Botão "Editar" dentro do modal navega para página de edição.
// Botão "Excluir" permanece direto na tabela.

import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { Badge }               from '../../../components/Atoms/Badge/Badge';
import { api }                 from '../../../services/Api';
import type { Magazine }       from '../../../types/Magazine';
import styles                  from './AdminMagazines.module.css';

export function AdminMagazines() {
  const navigate = useNavigate();

  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Magazine | null>(null);

  useEffect(() => {
    api.get<Magazine[]>('/magazines')
      .then(setMagazines)
      .catch(() => setError('Erro ao carregar revistas.'))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Excluir a revista "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/magazines/${id}`);
      setMagazines(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  }

  const filtered = search.trim()
    ? magazines.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.issn.includes(search)
      )
    : magazines;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Revistas Cadastradas</h1>
        <button className={styles.btnNova}
          onClick={() => navigate('/admin/magazines/create')}>
          + Cadastrar Nova Revista
        </button>
      </header>

      <input
        className={styles.search}
        placeholder="Buscar por nome ou ISSN..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {isLoading && <p className={styles.empty}>Carregando...</p>}
      {error     && <p className={styles.empty}>{error}</p>}
      {!isLoading && !error && filtered.length === 0 && (
        <p className={styles.empty}>Nenhuma revista encontrada.</p>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nome</th>
                <th className={styles.th}>ISSN</th>
                <th className={styles.th}>Área</th>
                <th className={styles.th}>Qualis</th>
                <th className={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={styles.tr}>
                  <td className={styles.td}>{m.name}</td>
                  <td className={styles.td}>{m.issn}</td>
                  <td className={styles.td}>{m.knowledgeArea}</td>
                  <td className={styles.td}><Badge label={m.qualis} /></td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button className={styles.btnDetalhes}
                        onClick={() => setSelected(m)}>
                        Detalhes
                      </button>
                      <button className={styles.btnExcluir}
                        onClick={() => void handleDelete(m.id, m.name)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalhes */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Detalhes da Revista</h2>
              <button className={styles.modalClose}
                onClick={() => setSelected(null)}>✕</button>
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
                <a href={selected.officialLink} target="_blank"
                  rel="noopener noreferrer" className={styles.modalLink}>
                  {selected.officialLink}
                </a>
              </div>

              <div className={styles.modalField}>
                <span className={styles.modalLabel}>Categoria</span>
                <span className={styles.modalValue}>{selected.knowledgeArea}</span>
              </div>

              <div className={styles.modalField}>
                <span className={styles.modalLabel}>O periódico possui taxa de publicação?</span>
                <Badge label={selected.hasFee ? 'Possui taxa' : 'Sem taxa'} />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnEditar}
                onClick={() => navigate(`/admin/magazines/${selected.id}`)}>
                Editar
              </button>
              <button className={styles.btnFechar}
                onClick={() => setSelected(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}