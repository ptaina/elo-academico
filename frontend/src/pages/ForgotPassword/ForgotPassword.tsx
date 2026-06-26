import { useState, type FormEvent } from 'react';
import { Link, useNavigate }        from 'react-router-dom';
import { Input }                    from '../../components/Atoms/Input/Input';
import { Button }                   from '../../components/Atoms/Button/Button';
import { api }                      from '../../services/Api';
import styles                       from './ForgotPassword.module.css';

const formatCPF = (v: string) =>
  v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})/,'$1-$2').slice(0,14);

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]     = useState<1 | 2>(1);
  const [cpf, setCpf]       = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      if (step === 1) {
        if (cpf.replace(/\D/g,'').length !== 11) {
          setError('Informe um CPF com 11 dígitos.'); return;
        }
        setStep(2);
      } else {
        if (newPassword !== confirmPassword) { setError('As senhas não conferem.'); return; }
        await api.post('/users/recover-password', {
          cpf:             cpf.replace(/\D/g,''),
          newPassword,
          confirmPassword,
        });
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recuperar senha.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.successMsg}>Senha alterada com sucesso! Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Recuperar Senha</h1>
        <p className={styles.subtitle}>
          {step === 1 ? 'Informe seu CPF cadastrado para continuar.' : 'Crie sua nova senha.'}
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {step === 1 ? (
            <Input label="CPF" name="cpf" type="text"
              value={formatCPF(cpf)} maxLength={14}
              onChange={e => setCpf(e.target.value)}
              placeholder="000.000.000-00" required />
          ) : (
            <>
              <Input label="Nova Senha" name="newPassword" type="password"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              <Input label="Confirmar Nova Senha" name="confirmPassword" type="password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </>
          )}
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            {step === 1 ? 'Verificar CPF' : 'Alterar Senha'}
          </Button>
        </form>

        <p className={styles.back}>
          <Link to="/login">← Voltar para o Login</Link>
        </p>
      </div>
    </div>
  );
}
