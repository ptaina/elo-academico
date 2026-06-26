// É a bolinha do qualis e pag/gratuito
import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
}

type BadgeVariant = 'qualisA' | 'qualisB' | 'qualisC' | 'neutral';

const labelVariantMap: Partial<Record<string, BadgeVariant>> = {
  'Aprovada':   'qualisA',
  'Em Análise': 'qualisC',
  'Rejeitada':  'neutral',
};

function resolveVariant(label: string): BadgeVariant {
  if (labelVariantMap[label]) return labelVariantMap[label] as BadgeVariant;
  const firstChar = label.trim().charAt(0).toUpperCase();
  if (firstChar === 'A') return 'qualisA';
  if (firstChar === 'B') return 'qualisB';
  if (firstChar === 'C') return 'qualisC';
  return 'neutral';
}

const variantClassMap: Record<BadgeVariant, string> = {
  qualisA: styles.qualisA,
  qualisB: styles.qualisB,
  qualisC: styles.qualisC,
  neutral: styles.neutral,
};

export function Badge({ label }: BadgeProps) {
  const variant = resolveVariant(label);

  return (
    <span className={`${styles.badge} ${variantClassMap[variant]}`}>
      {label}
    </span>
  );
}