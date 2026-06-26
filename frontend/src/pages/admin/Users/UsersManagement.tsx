// frontend/src/pages/admin/Users/UsersManagement.tsx
//
// MUDANÇA: botão "Detalhes" abre modal com nome, e-mail, status,
// data de cadastro e quantidade de sugestões.
// Botão "Banir" permanece direto na tabela e abre campo de motivo inline.

import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { Badge }               from '../../../components/Atoms/Badge/Badge';
import { useAuth }             from '../../../context/AuthContext';
import { api }                 from '../../../services/Api';
import type { User }           from '../../../types/User';
import styles                  from './UsersManagement.module.css';

interface UserWithMeta extends User {
  createdAt?: string;
  suggestionCount?: number;
}

export function UsersManagement() {
  const { isSuperAdmin }  = useAuth();
  const navigate          = useNavigate();

  const [users, setUsers]         = useState<UserWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');
  const [tab, setTab]             = useState<'contributors' | 'admins'>('contributors');

  // Modal de detalhes
  const [selected, setSelected]   = useState<UserWithMeta | null>(null);

  // Banimento inline
  const [banningId, setBanningId]   = useState<number | null>(null);
  const [banReason, setBanReason]   = useState('');
  const [banError, setBanError]     = useState('');

  useEffect(() => {
    setIsLoading(true); setError('');
    const endpoint = tab === 'contributors' ? '/users/contributors' : '/users/admins';
    api.get<UserWithMeta[]>(endpoint)
      .then(setUsers)
      .catch(() => setError('Não foi possível carregar os usuários.'))
      .finally(() => setIsLoading(false));
  }, [tab]);

  async function handleBan(id: number) {
    if (!banReason.trim()) { setBanError('O motivo é obrigatório.'); return; }
    try {
      await api.patch(`/users/${id}/block`, { reason: banReason });
      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, status: 'BLOCKED', banReason } : u
      ));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'BLOCKED' } : null);
      setBanningId(null); setBanReason(''); setBanError('');
    } catch (err) {
      setBanError(err instanceof Error ? err.message : 'Erro ao banir usuário.');
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gerenciar Usuários</h1>
        {isSuperAdmin && (
          <button className={styles.btnNovo}
            onClick={() => navigate('/admin/admins/create')}>
            + Criar Administrador
          </button>
        )}
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'contributors' ? styles.tabActive : ''}`}
          onClick={() => setTab('contributors')}>
          Contribuidores
        </button>
        <button
          className={`${styles.tab} ${tab === 'admins' ? styles.tabActive : ''}`}
          onClick={() => setTab('admins')}>
          Administradores
        </button>
      </nav>

      {isLoading && <p className={styles.empty}>Carregando...</p>}
      {error     && <p className={styles.empty}>{error}</p>}
      {!isLoading && !error && users.length === 0 && (
        <p className={styles.empty}>Nenhum usuário encontrado.</p>
      )}

      {!isLoading && !error && users.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nome</th>
                <th className={styles.th}>E-mail</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <>
                  <tr key={u.id} className={styles.tr}>
                    <td className={styles.td}>{u.name}</td>
                    <td className={styles.td}>{u.email}</td>
                    <td className={styles.td}>
                      <Badge label={u.status === 'BLOCKED' ? 'Bloqueado' : 'Ativo'} />
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button className={styles.btnDetalhes}
                          onClick={() => setSelected(u)}>
                          Detalhes
                        </button>
                        {tab === 'contributors' && u.status !== 'BLOCKED' && (
                          <button className={styles.btnBanir}
                            onClick={() => {
                              setBanningId(u.id);
                              setBanReason('');
                              setBanError('');
                            }}>
                            Banir usuário
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Campo de banimento inline */}
                  {banningId === u.id && (
                    <tr key={`ban-${u.id}`} className={styles.trBan}>
                      <td colSpan={4} className={styles.tdBan}>
                        <div className={styles.banInline}>
                          <label className={styles.banLabel}>
                            Motivo do banimento <span className={styles.required}>*</span>
                          </label>
                          {banError && <p className={styles.banError}>{banError}</p>}
                          <textarea
                            className={styles.banTextarea}
                            rows={2}
                            value={banReason}
                            onChange={e => setBanReason(e.target.value)}
                            placeholder="Descreva o motivo..."
                          />
                          <div className={styles.banActions}>
                            <button className={styles.btnConfirmarBan}
                              onClick={() => void handleBan(u.id)}>
                              Confirmar Banimento
                            </button>
                            <button className={styles.btnCancelar}
                              onClick={() => {
                                setBanningId(null);
                                setBanReason('');
                                setBanError('');
                              }}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalhes do usuário */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Detalhes do Usuário</h2>
              <button className={styles.modalClose}
                onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <span className={styles.modalLabel}>Nome</span>
                <span className={styles.modalValue}>{selected.name}</span>
              </div>

              <div className={styles.modalField}>
                <span className={styles.modalLabel}>E-mail</span>
                <span className={styles.modalValue}>{selected.email}</span>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Status</span>
                  <Badge label={selected.status === 'BLOCKED' ? 'Bloqueado' : 'Ativo'} />
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Papel</span>
                  <Badge label={
                    selected.role === 'SUPERADMIN' ? 'Super Admin'
                    : selected.role === 'ADMIN' ? 'Admin'
                    : 'Contribuidor'
                  } />
                </div>
              </div>

              {selected.createdAt && (
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Data de Cadastro</span>
                  <span className={styles.modalValue}>{formatDate(selected.createdAt)}</span>
                </div>
              )}

              {selected.suggestionCount !== undefined && (
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Submissões Enviadas</span>
                  <span className={styles.modalValue}>{selected.suggestionCount}</span>
                </div>
              )}

              {selected.status === 'BLOCKED' && selected.banReason && (
                <div className={styles.modalField}>
                  <span className={styles.modalLabel}>Motivo do Banimento</span>
                  <span className={styles.modalBanned}>{selected.banReason}</span>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
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