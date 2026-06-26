// frontend/src/pages/Register/CreateAccount.tsx
// MUDANÇA: removidos street, number, complement, neighborhood
// Ficam: name, email, password, confirmPassword, cpf, phone, zipCode, city, state

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { Input }               from '../../components/Atoms/Input/Input';
import { Button }              from '../../components/Atoms/Button/Button';
import { api }                 from '../../services/Api';
import styles                  from './CreateAccount.module.css';

interface RegisterForm {
  name:            string;
  cpf:             string;
  email:           string;
  password:        string;
  confirmPassword: string;
  phone:           string;
  zipCode:         string;
  city:            string;
  state:           string;
  acceptedTerms:   boolean;
}

interface RegisterErrors { [key: string]: string | null; }

const formatCPF     = (v: string) => v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})/,'$1-$2').slice(0,14);
const formatPhone   = (v: string) => v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d{1,4})/,'$1-$2').slice(0,15);
const formatZipCode = (v: string) => v.replace(/\D/g,'').replace(/(\d{5})(\d{1,3})/,'$1-$2').slice(0,9);

const MASKS: Record<string, (v: string) => string> = {
  cpf:     formatCPF,
  phone:   formatPhone,
  zipCode: formatZipCode,
};

const EMPTY: RegisterForm = {
  name: '', cpf: '', email: '', password: '', confirmPassword: '',
  phone: '', zipCode: '', city: '', state: '', acceptedTerms: false,
};

export function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm]     = useState<RegisterForm>(EMPTY);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Autocomplete de cidade e estado pelo CEP via ViaCEP
  async function fetchAddress(zip: string) {
    const cleaned = zip.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setForm(prev => ({
          ...prev,
          city:  d.localidade ?? prev.city,
          state: d.uf         ?? prev.state,
        }));
      }
    } catch { /* ignora erro de CEP */ }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value, type, checked } = e.target;
    const masker    = MASKS[name];
    const finalValue = type === 'checkbox' ? checked : (masker ? masker(value) : value);
    setForm(prev => ({ ...prev, [name]: finalValue }));
    if (name === 'zipCode') {
      const formatted = formatZipCode(value);
      if (formatted.replace(/\D/g, '').length === 8) void fetchAddress(formatted);
    }
    setErrors(prev => ({ ...prev, [name]: null, form: null }));
  }

  function validate(): boolean {
    const e: RegisterErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name.trim() || form.name.trim().length < 3) e['name'] = 'Nome completo (mínimo 3 caracteres).';
    if (form.cpf.replace(/\D/g,'').length !== 11)         e['cpf']  = 'CPF deve conter 11 dígitos.';
    if (!emailRegex.test(form.email))                      e['email'] = 'E-mail inválido.';
    if (form.password.length < 8)                          e['password'] = 'Mínimo 8 caracteres.';
    if (form.password !== form.confirmPassword)             e['confirmPassword'] = 'As senhas não conferem.';
    if (form.phone.replace(/\D/g,'').length < 10)          e['phone'] = 'Telefone inválido.';
    if (form.zipCode.replace(/\D/g,'').length !== 8)       e['zipCode'] = 'CEP deve ter 8 dígitos.';
    if (!form.city.trim())                                 e['city']  = 'Cidade obrigatória.';
    if (!form.state.trim())                                e['state'] = 'Estado obrigatório.';
    if (!form.acceptedTerms)                               e['acceptedTerms'] = 'Aceite os termos para continuar.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await api.post('/users/register', {
        name:            form.name.trim(),
        email:           form.email.trim().toLowerCase(),
        password:        form.password,
        confirmPassword: form.confirmPassword,
        cpf:             form.cpf.replace(/\D/g, ''),
        phone:           form.phone.replace(/\D/g, ''),
        zipCode:         form.zipCode.replace(/\D/g, ''),
        city:            form.city.trim(),
        state:           form.state.trim().toUpperCase(),
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Erro ao criar conta.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <h1 className={styles.logoTitle}>Elo Acadêmico</h1>
          <p className={styles.logoSubtitle}>
            Junte-se à comunidade e descubra as melhores revistas para sua publicação.
          </p>
        </div>
      </section>

      <main className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <header className={styles.formHeader}>
            <h2 className={styles.formTitle}>Criar Conta</h2>
            <p className={styles.formSubtitle}>Preencha os dados para começar</p>
          </header>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            <Input label="Nome Completo" name="name" type="text"
              placeholder="Seu nome completo"
              value={form.name} onChange={handleChange}
              error={errors['name'] ?? ''} required />

            <div className={styles.fieldRow}>
              <Input label="CPF" name="cpf" type="text"
                placeholder="000.000.000-00" maxLength={14}
                value={form.cpf} onChange={handleChange}
                error={errors['cpf'] ?? ''} required />
              <Input label="Telefone" name="phone" type="tel"
                placeholder="(00) 00000-0000" maxLength={15}
                value={form.phone} onChange={handleChange}
                error={errors['phone'] ?? ''} required />
            </div>

            <Input label="E-mail" name="email" type="email"
              placeholder="seu@email.com"
              value={form.email} onChange={handleChange}
              error={errors['email'] ?? ''} required />

            <div className={styles.fieldRow}>
              <Input label="Senha" name="password" type="password"
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                error={errors['password'] ?? ''} required />
              <Input label="Confirmar Senha" name="confirmPassword" type="password"
                placeholder="••••••••"
                value={form.confirmPassword} onChange={handleChange}
                error={errors['confirmPassword'] ?? ''} required />
            </div>

            <div className={styles.fieldRow}>
              <Input label="CEP" name="zipCode" type="text"
                placeholder="00000-000" maxLength={9}
                value={form.zipCode} onChange={handleChange}
                error={errors['zipCode'] ?? ''} required />
              <Input label="Estado (UF)" name="state" type="text"
                placeholder="PR" maxLength={2}
                value={form.state}
                onChange={e => {
                  setForm(prev => ({ ...prev, state: e.target.value.toUpperCase() }));
                  setErrors(prev => ({ ...prev, state: null }));
                }}
                error={errors['state'] ?? ''} required />
            </div>

            <Input label="Cidade" name="city" type="text"
              placeholder="Preenchida automaticamente pelo CEP"
              value={form.city} onChange={handleChange}
              error={errors['city'] ?? ''} required />

            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="acceptedTerms"
                checked={form.acceptedTerms} onChange={handleChange}
                className={styles.hiddenCheckbox} />
              <span className={styles.customCheckbox} />
              <span className={styles.checkboxText}>
                Concordo com os <Link to="/termos" className={styles.inlineLink}>Termos de Uso</Link>
              </span>
            </label>
            {errors['acceptedTerms'] && <p className={styles.fieldError}>{errors['acceptedTerms']}</p>}

            {errors['form'] && <p className={styles.formError} role="alert">{errors['form']}</p>}

            <Button type="submit" variant="primary"
              isLoading={isLoading} disabled={isLoading}>
              Criar Conta
            </Button>
          </form>

          <footer className={styles.formFooter}>
            <p>Já tem conta? <Link to="/login" className={styles.footerLinkBold}>Entrar</Link></p>
            <Link to="/" className={styles.backHomeLink}>← Página inicial</Link>
          </footer>
        </div>
      </main>
    </div>
  );
}