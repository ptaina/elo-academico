import { useState, type FormEvent } from 'react';
import { useNavigate }              from 'react-router-dom';
import { Input }                    from '../../../components/Atoms/Input/Input';
import { Button }                   from '../../../components/Atoms/Button/Button';
import { useAuth }                  from '../../../context/AuthContext';
import { api }                      from '../../../services/Api';
import styles                       from './AdminCreate.module.css';

export function AdminCreate() {
  const { isSuperAdmin } = useAuth();
  const navigate         = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  if (!isSuperAdmin) {
    return (
      <div className={styles.container}>
        <p className={styles.forbidden}>Acesso restrito ao administrador principal.</p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password !== confirmPassword) { setError('As senhas não conferem.'); return; }
    setIsLoading(true);
    try {
      await api.post('/users/admin', { email, password });
      setSuccess(`Administrador criado com sucesso: ${email}`);
      setEmail(''); setPassword(''); setConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar administrador.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/admin/users')}>← Voltar</button>
        <h1 className={styles.title}>Criar Novo Administrador</h1>
        <p className={styles.subtitle}>O administrador poderá gerenciar revistas, categorias e sugestões.</p>
      </header>

      {success && <p className={styles.success}>{success}</p>}
      {error   && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input label="E-mail do Administrador" name="email" type="email"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Senha" name="password" type="password"
          value={password} onChange={e => setPassword(e.target.value)} required />
        <Input label="Confirmar Senha" name="confirmPassword" type="password"
          value={confirmPassword} onChange={e => setConfirm(e.target.value)} required />
        <p className={styles.note}>Mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.</p>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          Criar Administrador
        </Button>
      </form>
    </div>
  );
}
