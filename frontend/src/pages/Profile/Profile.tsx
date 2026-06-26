// frontend/src/pages/Profile/Profile.tsx

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input }       from '../../components/Atoms/Input/Input';
import { Button }      from '../../components/Atoms/Button/Button';
import { useAuth }     from '../../context/AuthContext';
import { api }         from '../../services/Api';
import styles          from './Profile.module.css';

type Tab = 'info' | 'address' | 'password';

const formatPhone   = (v: string) => v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d{1,4})/,'$1-$2').slice(0,15);
const formatZipCode = (v: string) => v.replace(/\D/g,'').replace(/(\d{5})(\d{1,3})/,'$1-$2').slice(0,9);

export function Profile() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // MUDANÇA: removidos street, number, complement, neighborhood do estado
  const [info, setInfo] = useState({
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });

  const [address, setAddress] = useState({
    zipCode: user?.zipCode ?? '',
    city:    user?.city    ?? '',
    state:   user?.state   ?? '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword:    '',
    newPassword:        '',
    confirmNewPassword: '',
  });

  // MUDANÇA: useEffect atualiza só os campos que existem agora
  useEffect(() => {
    if (user) {
      setInfo({
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
      setAddress({
        zipCode: user.zipCode ?? '',
        city:    user.city    ?? '',
        state:   user.state   ?? '',
      });
    }
  }, [user]);

  // Autocomplete de cidade e estado pelo CEP — mantido pois cidade e estado ficam
  async function fetchAddress(zip: string) {
    const cleaned = zip.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await resp.json();
      if (!data.erro) {
        setAddress(prev => ({
          ...prev,
          city:  data.localidade ?? prev.city,
          state: data.uf         ?? prev.state,
        }));
      }
    } catch { /* ignora erro de CEP */ }
  }

  function handleZipChange(e: ChangeEvent<HTMLInputElement>) {
    const formatted = formatZipCode(e.target.value);
    setAddress(prev => ({ ...prev, zipCode: formatted }));
    if (formatted.replace(/\D/g, '').length === 8) void fetchAddress(formatted);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(''); setIsLoading(true);
    try {
      const payload: Record<string, string> = {};

      if (activeTab === 'info') {
        if (info.email) payload['email'] = info.email;
        if (info.phone) payload['phone'] = info.phone.replace(/\D/g, '');
      } else if (activeTab === 'address') {
        // MUDANÇA: payload de endereço só com zipCode, city e state
        if (address.zipCode) payload['zipCode'] = address.zipCode.replace(/\D/g, '');
        if (address.city)    payload['city']    = address.city;
        if (address.state)   payload['state']   = address.state;
      } else {
        Object.assign(payload, passwords);
      }

      await api.patch('/users/me', payload);
      setSuccess('Dados atualizados com sucesso!');
      if (activeTab === 'password') {
        setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) return;
    try {
      await api.delete('/users/me');
      logout();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir conta.');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
  <button className={styles.backBtn} onClick={() => navigate(-1)}>
    ← Voltar
  </button>
  <div className={styles.userInfo}>
    <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</div>
    <div>
      <h1 className={styles.name}>{user?.name}</h1>
      <p className={styles.role}>{user?.role === 'CONTRIBUTOR' ? 'Contribuidor' : 'Administrador'}</p>
    </div>
  </div>
</header>

        <nav className={styles.tabs}>
          {(['info', 'address', 'password'] as Tab[]).map(tab => (
            <button key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}>
              {{ info: 'Dados Pessoais', address: 'Endereço', password: 'Senha' }[tab]}
            </button>
          ))}
        </nav>

        {success && <p className={styles.success}>{success}</p>}
        {error   && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSave} className={styles.form}>
          {activeTab === 'info' && (
            <>
              <Input label="E-mail" name="email" type="email"
                value={info.email}
                onChange={e => setInfo(prev => ({ ...prev, email: e.target.value }))} />
              <Input label="Telefone" name="phone" type="tel" maxLength={15}
                value={formatPhone(info.phone)}
                onChange={e => setInfo(prev => ({ ...prev, phone: e.target.value }))} />
              <p className={styles.note}>Nome e CPF não podem ser alterados.</p>
            </>
          )}

          {activeTab === 'address' && (
            // MUDANÇA: aba de endereço simplificada — apenas CEP, cidade e estado
            <>
              <Input label="CEP" name="zipCode" maxLength={9}
                value={address.zipCode}
                onChange={handleZipChange} />
              <Input label="Cidade" name="city"
                value={address.city}
                onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))} />
              <Input label="Estado (UF)" name="state" maxLength={2}
                value={address.state}
                onChange={e => setAddress(prev => ({ ...prev, state: e.target.value.toUpperCase() }))} />
              <p className={styles.note}>Ao preencher o CEP, cidade e estado são preenchidos automaticamente.</p>
            </>
          )}

          {activeTab === 'password' && (
            <>
              <Input label="Senha Atual" name="currentPassword" type="password"
                value={passwords.currentPassword}
                onChange={e => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))} />
              <Input label="Nova Senha" name="newPassword" type="password"
                value={passwords.newPassword}
                onChange={e => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))} />
              <Input label="Confirmar Nova Senha" name="confirmNewPassword" type="password"
                value={passwords.confirmNewPassword}
                onChange={e => setPasswords(prev => ({ ...prev, confirmNewPassword: e.target.value }))} />
              <p className={styles.note}>Mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.</p>
            </>
          )}

          <div className={styles.actions}>
            <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
              Salvar Alterações
            </Button>
          </div>
        </form>

        <div className={styles.danger}>
          <h3 className={styles.dangerTitle}>Zona de Perigo</h3>
          <p className={styles.dangerText}>A exclusão da conta é permanente e não pode ser desfeita.</p>
          <Button variant="danger" size="sm" onClick={() => void handleDeleteAccount()}>
            Excluir minha conta
          </Button>
        </div>
      </div>
    </div>
  );
}