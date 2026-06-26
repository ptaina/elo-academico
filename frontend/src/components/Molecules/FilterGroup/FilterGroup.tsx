import { SectionTitle } from '../../Atoms/SectionTitle/SectionTitle';
import { Checkbox } from '../../Atoms/Checkbox/Checkbox';
import styles from './FilterGroup.module.css';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: FilterGroupProps) {
  return (
    <div className={styles.group}>
      <SectionTitle>{title}</SectionTitle>

      <ul className={styles.list}>
        {options.map((option) => (
          <li key={option.id}>
            <Checkbox
              id={option.id}
              label={option.label}
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}