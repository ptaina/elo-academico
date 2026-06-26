import styles from './Stats.module.css';

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { value: '12.400+', label: 'Pesquisadores'    },
  { value: '280+',    label: 'Instituições'      },
  { value: '47',      label: 'Países'            },
];

export function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.grid}>
        {stats.map((item) => (
          <div key={item.label} className={styles.item}>
            <span className={styles.value}>{item.value}</span>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}