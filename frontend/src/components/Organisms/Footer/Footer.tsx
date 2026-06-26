// frontend/src/components/Organisms/Footer/Footer.tsx

import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Elo Acadêmico</span>
          <p className={styles.brandDesc}>
            Plataforma de pesquisa de periódicos científicos com classificação Qualis da CAPES.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Plataforma</h4>
            <a href="/search" className={styles.link}>Buscar Revistas</a>
            <a href="/register" className={styles.link}>Criar Conta</a>
            <a href="/login" className={styles.link}>Entrar</a>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Informações</h4>
            <a href="/search" className={styles.link}>Classificação Qualis</a>
            <a href="/search" className={styles.link}>Taxas de Publicação</a>
            <a href="/search" className={styles.link}>Áreas do Conhecimento</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {currentYear} Elo Acadêmico. Desenvolvido por Tainá e Mariana.
        </p>
      </div>
    </footer>
  );
}