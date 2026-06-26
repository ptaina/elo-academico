import { Hero }   from './Components/Hero/Hero';
import { Stats }  from './Components/Stats/Stats';
import { Footer } from '../../components/Organisms/Footer/Footer';
import styles     from './Home.module.css';

// Ícones SVG monocromáticos na cor institucional
function IconSearch() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
      <line x1="2"  y1="20" x2="22" y2="20" />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <path d="M9 10h4.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3H15" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function Home() {
  return (
    <div className={styles.homeContainer}>
      <Hero />

      <section className={styles.featuresSection}>
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle}>
            Tudo que você precisa para escolher a revista certa
          </h2>
          <p className={styles.featuresSubtitle}>
            O Elo Acadêmico centraliza as informações essenciais de periódicos
            científicos brasileiros em um só lugar.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><IconSearch /></div>
              <h3 className={styles.featureCardTitle}>Pesquisa com Filtros</h3>
              <p className={styles.featureCardText}>
                Filtre por área do conhecimento, classificação Qualis e taxa de
                publicação. Encontre exatamente o que precisa em segundos.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><IconChart /></div>
              <h3 className={styles.featureCardTitle}>Classificação Qualis</h3>
              <p className={styles.featureCardText}>
                Todas as revistas classificadas de A1 a C conforme os critérios
                da CAPES, do maior para o menor impacto acadêmico.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><IconCoin /></div>
              <h3 className={styles.featureCardTitle}>Transparência de Taxas</h3>
              <p className={styles.featureCardText}>
                Saiba de imediato se a revista cobra taxa de publicação (APC)
                ou é completamente gratuita para o autor.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><IconEdit /></div>
              <h3 className={styles.featureCardTitle}>Sugira uma Revista</h3>
              <p className={styles.featureCardText}>
                Contribua com a comunidade acadêmica sugerindo novos periódicos.
                Sua sugestão é avaliada pela nossa equipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Stats />
      <Footer />
    </div>
  );
}