import { useState, useEffect, useCallback } from 'react';
import { Input }          from '../../components/Atoms/Input/Input';
import { Button }         from '../../components/Atoms/Button/Button';
import { FilterSidebar }  from '../../components/Organisms/FilterSidebar/Filtersidebar';
import { CardMagazine }   from '../../components/Molecules/CardMagazine/cardMagazine';
import styles             from './SearchMagazines.module.css';
import type { Magazine }  from '../../types/Magazine';

interface ActiveFilters {
  knowledgeAreas: string[];
  qualis:         string[];
  publicationFee: string[];
}

export function SearchMagazines() {
  const [magazines, setMagazines]         = useState<Magazine[]>([]);
  const [searchTerm, setSearchTerm]       = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    knowledgeAreas: [],
    qualis:         [],
    publicationFee: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError]         = useState<string>('');

  const fetchMagazines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (searchTerm.trim())              params.set('search', searchTerm.trim());
      if (activeFilters.knowledgeAreas.length === 1) params.set('knowledgeArea', activeFilters.knowledgeAreas[0]!);
      if (activeFilters.qualis.length === 1)          params.set('qualis', activeFilters.qualis[0]!.toUpperCase());
      if (activeFilters.publicationFee.length === 1) {
        params.set('hasFee', activeFilters.publicationFee[0] === 'paid' ? 'true' : 'false');
      }

      const url = `/api/magazines${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      const data: Magazine[] = await response.json();
      setMagazines(data);
    } catch {
      setError('Não foi possível carregar as revistas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, activeFilters]);

  useEffect(() => {
    void fetchMagazines();
  }, [fetchMagazines]);

  function handleApplyFilters(filters: ActiveFilters): void {
    setActiveFilters(filters);
  }

  const hasActiveSearch = searchTerm.trim().length > 0;

  return (
    <div className={styles.pageWrapper}>
      <FilterSidebar onApply={handleApplyFilters} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Buscar Revistas</h1>
          <p className={styles.description}>
            Encontre periódicos científicos de alto impacto para a sua próxima publicação.
          </p>
        </header>

        <section className={styles.searchSection}>
          <div className={styles.searchBar}>
            <Input
              placeholder="Digite o nome da revista, ISSN ou área de conhecimento..."
              aria-label="Buscar revistas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" size="md" onClick={() => void fetchMagazines()}>
              Buscar
            </Button>
          </div>
        </section>

        <section className={styles.resultsSection}>
          {isLoading && <p className={styles.resultsTitle}>Carregando...</p>}
          {error && <p className={styles.emptyMessage}>{error}</p>}

          {!isLoading && !error && (
            <>
              <h2 className={styles.resultsTitle}>
                {hasActiveSearch
                  ? `${magazines.length} resultado${magazines.length !== 1 ? 's' : ''} encontrado${magazines.length !== 1 ? 's' : ''}`
                  : `${magazines.length} revistas cadastradas`}
              </h2>

              {magazines.length > 0 ? (
                <div className={styles.grid}>
                  {magazines.map((magazine) => (
                    <CardMagazine
                      key={magazine.id}
                      id={magazine.id}
                      name={magazine.name}
                      knowledgeArea={magazine.knowledgeArea}
                      qualis={magazine.qualis}
                      hasFee={magazine.hasFee}
                      officialLink={magazine.officialLink}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyMessage}>
                  Nenhuma revista encontrada. Tente ajustar os filtros ou o termo de busca.
                </p>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
