import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return <h3 className={styles.title}>{children}</h3>;
}