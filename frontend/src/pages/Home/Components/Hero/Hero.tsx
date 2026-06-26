import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/Atoms/Button/Button';
import styles from './Hero.module.css';

interface MockJournal {
  id: number;
  name: string;
  issn: string;
  area: string;
  qualis: string;
  apcFree: boolean;
  apcPrice?: string;
}

const mockJournals: MockJournal[] = [
  { id: 1, name: 'Revista Brasileira de Ciência da Computação', issn: '1234-5678', area: 'Ciência da Computação', qualis: 'A1', apcFree: true  },
  { id: 2, name: 'Brazilian Journal of Medical Research',       issn: '2345-6789', area: 'Ciências da Saúde',     qualis: 'A2', apcFree: false, apcPrice: 'R$ 450,00' },
  { id: 3, name: 'Cadernos de Educação e Pesquisa',             issn: '3456-7890', area: 'Educação',              qualis: 'B1', apcFree: true  },
  { id: 4, name: 'Periódico de Direito Ambiental',              issn: '4567-8901', area: 'Direito',               qualis: 'A3', apcFree: false, apcPrice: 'R$ 280,00' },
];

const qualisColorMap: Record<string, string> = {
  A1: styles.qualisA1,
  A2: styles.qualisA2,
  A3: styles.qualisA3,
  A4: styles.qualisA4,
  B1: styles.qualisB1,
  B2: styles.qualisB2,
};

const avatarStack = ['MS', 'RT', 'AL', 'CF', 'BN'];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      {/* ── coluna esquerda ── */}
      <div className={styles.leftCol}>
        <h1 className={styles.headline}>
          Encontre a revista perfeita para sua próxima{' '}
          <span className={styles.headlineAccent}>publicação científica.</span>
        </h1>

        <p className={styles.subtext}>
          Busque em nossa base de dados inteligente por periódicos nacionais. Filtre por <strong>Qualis</strong> (A1 a C),{' '}
          <strong>área de conhecimento</strong>, ISSN, links oficiais e verifique
          instantaneamente se a revista cobra taxas de publicação (APC) ou é
          gratuita.
        </p>

        <div className={styles.ctaRow}>
          <Button variant="primary" size="lg" onClick={() => navigate('/search')}>
            Buscar Revistas Gratuitamente →
          </Button>
        </div>

        <div className={styles.socialProof}>
          <div className={styles.avatarStack}>
            {avatarStack.map((initials) => (
              <div key={initials} className={styles.avatarChip}>
                {initials}
              </div>
            ))}
          </div>
          <div className={styles.socialText}>
            <span className={styles.socialCount}>15.000+ pesquisadores</span>
            <span className={styles.socialSub}>já encontraram sua revista ideal</span>
          </div>
        </div>
      </div>

      {/* ── coluna direta ── */}
      <div className={styles.rightCol} aria-hidden="true">
        <div className={styles.browserChrome}>
          <div className={styles.chromeDots}>
            <span /><span /><span />
          </div>
          <div className={styles.chromeBar}>
            <span className={styles.chromeGlobe}>⊕</span>
            <span className={styles.chromeUrl}>app.eloacademico.com.br/buscar</span>
          </div>
        </div>

        <div className={styles.mockupBody}>
          {/* ── pesquisa ── */}
          <div className={styles.mockSearchBar}>
            <span className={styles.mockSearchIcon}>🔍</span>
            <span className={styles.mockSearchText}>ciência da computação</span>
            <span className={styles.mockSearchBtn}>Buscar</span>
          </div>

          {/* filtro */}
          <div className={styles.mockFilterRow}>
            <span className={styles.mockFilterChip}>Qualis: A1, A2</span>
            <span className={styles.mockFilterChip}>Sem taxa APC</span>
            <span className={styles.mockFilterClear}>✕ Limpar</span>
          </div>

          {/* Resultados */}
          <div className={styles.mockResultsHeader}>
            <span className={styles.mockResultsCount}>4 revistas encontradas</span>
          </div>

          {/* Lista */}
          <div className={styles.mockJournalList}>
            {mockJournals.map((journal) => (
              <div key={journal.id} className={styles.mockJournalItem}>
                <div className={styles.mockJournalTop}>
                  <span className={styles.mockJournalName}>{journal.name}</span>
                  <span className={`${styles.mockQualisBadge} ${qualisColorMap[journal.qualis] ?? styles.qualisDefault}`}>
                    {journal.qualis}
                  </span>
                </div>
                <div className={styles.mockJournalMeta}>
                  <span className={styles.mockIssnTag}>ISSN {journal.issn}</span>
                  <span className={styles.mockAreaTag}>{journal.area}</span>
                  <span className={journal.apcFree ? styles.mockApcFree : styles.mockApcPaid}>
                    {journal.apcFree ? '✓ Gratuita' : `APC: ${journal.apcPrice}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}