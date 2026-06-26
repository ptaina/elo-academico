import { useState, useEffect } from 'react';
import { FilterGroup }         from '../../Molecules/FilterGroup/FilterGroup';
import { api }                 from '../../../services/Api';
import styles                  from './FilterSidebar.module.css';

interface SelectedFilters {
  knowledgeAreas: string[];
  qualis:         string[];
  publicationFee: string[];
}

interface FilterSidebarProps {
  onApply?: (filters: SelectedFilters) => void;
}

const QUALIS_OPTIONS = [
  { id: 'A1', label: 'A1' }, { id: 'A2', label: 'A2' },
  { id: 'A3', label: 'A3' }, { id: 'A4', label: 'A4' },
  { id: 'B1', label: 'B1' }, { id: 'B2', label: 'B2' },
  { id: 'B3', label: 'B3' }, { id: 'B4', label: 'B4' },
  { id: 'C',  label: 'C'  },
];

const FEE_OPTIONS = [
  { id: 'free', label: 'Gratuita' },
  { id: 'paid', label: 'Paga'     },
];

const EMPTY: SelectedFilters = { knowledgeAreas: [], qualis: [], publicationFee: [] };

export function FilterSidebar({ onApply }: FilterSidebarProps) {
  const [selected, setSelected]   = useState<SelectedFilters>(EMPTY);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    api.get<{ id: number; name: string }[]>('/categories')
      .then(cats => setCategories(cats.map(c => ({ id: c.name, label: c.name }))))
      .catch(() => null);
  }, []);

  function toggle(group: keyof SelectedFilters, id: string) {
    setSelected(prev => {
      const current = prev[group];
      const updated  = current.includes(id)
        ? current.filter(x => x !== id)
        : [...current, id];
      return { ...prev, [group]: updated };
    });
  }

  function handleApply() {
    onApply?.(selected);
  }

  function handleReset() {
    setSelected(EMPTY);
    onApply?.(EMPTY);
  }

  const hasFilters =
    selected.knowledgeAreas.length > 0 ||
    selected.qualis.length > 0 ||
    selected.publicationFee.length > 0;

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Filtros</h2>
        {hasFilters && (
          <button className={styles.clearBtn} onClick={handleReset}>
            Limpar
          </button>
        )}
      </header>

      {categories.length > 0 && (
        <FilterGroup
          title="Área do Conhecimento"
          options={categories}
          selected={selected.knowledgeAreas}
          onToggle={id => toggle('knowledgeAreas', id)}
        />
      )}

      <FilterGroup
        title="Classificação Qualis"
        options={QUALIS_OPTIONS}
        selected={selected.qualis}
        onToggle={id => toggle('qualis', id)}
      />

      <FilterGroup
        title="Taxa de Publicação"
        options={FEE_OPTIONS}
        selected={selected.publicationFee}
        onToggle={id => toggle('publicationFee', id)}
      />

      <button className={styles.applyBtn} onClick={handleApply}>
        Aplicar Filtros
      </button>
    </aside>
  );
}
