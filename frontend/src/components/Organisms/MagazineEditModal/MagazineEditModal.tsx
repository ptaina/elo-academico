import { useState, useEffect } from 'react';
import { Modal } from '../../Atoms/Modal/Modal';
import { Button } from '../../Atoms/Button/Button';
import type { Magazine } from '../MagazineTable/MagazineTable';
import styles from './MagazineEditModal.module.css';

const qualisOptions = ['A1','A2','A3','A4','B1','B2','B3','B4','C'];

const categoryOptions = [
  'Ciências Exatas',
  'Ciências Humanas',
  'Ciências Biológicas',
  'Ciências da Saúde',
  'Ciências Agrárias',
  'Engenharias',
  'Ciências Sociais Aplicadas',
  'Linguística, Letras e Artes',
];

interface MagazineEditForm {
  name: string;
  issn: string;
  qualis: string;
  description: string;
  officialLink: string;
  category: string;
  hasFee: boolean;
}

interface MagazineEditModalProps {
  magazine: Magazine | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Magazine) => void;
}

export function MagazineEditModal({
  magazine,
  isOpen,
  onClose,
  onSave,
}: MagazineEditModalProps) {
  const [form, setForm] = useState<MagazineEditForm>({
    name: '', issn: '', qualis: 'A1', description: '',
    officialLink: '', category: '', hasFee: false,
  });

  useEffect(() => {
    if (magazine) {
      const timer = setTimeout(() => {
        setForm({
          name:         magazine.name,
          issn:         magazine.issn,
          qualis:       magazine.qualis,
          description:  magazine.description,
          officialLink: magazine.officialLink,
          category:     magazine.category,
          hasFee:       magazine.hasFee,
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [magazine]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFeeChange(value: boolean): void {
    setForm((prev) => ({ ...prev, hasFee: value }));
  }

  function handleSave(): void {
    if (!magazine) return;
    onSave({ ...magazine, ...form });
  }

  if (!magazine) return null;

  return (
    <Modal isOpen={isOpen} title="Editar Revista" onClose={onClose}>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-name">Nome da Revista</label>
          <input
            id="edit-name"
            name="name"
            className={styles.input}
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-issn">ISSN</label>
            <input
              id="edit-issn"
              name="issn"
              className={styles.input}
              value={form.issn}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-qualis">Qualis</label>
            <select
              id="edit-qualis"
              name="qualis"
              className={styles.select}
              value={form.qualis}
              onChange={handleChange}
            >
              {qualisOptions.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-description">Descrição</label>
          <textarea
            id="edit-description"
            name="description"
            className={styles.textarea}
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-link">Link Oficial</label>
          <input
            id="edit-link"
            name="officialLink"
            className={styles.input}
            value={form.officialLink}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-category">Categoria</label>
          <select
            id="edit-category"
            name="category"
            className={styles.select}
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>O periódico possui taxa de publicação?</span>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="hasFee"
                checked={!form.hasFee}
                onChange={() => handleFeeChange(false)}
                className={styles.radioInput}
              />
              Sem taxa
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="hasFee"
                checked={form.hasFee}
                onChange={() => handleFeeChange(true)}
                className={styles.radioInput}
              />
              Possui taxa
            </label>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="secondary" size="md" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" size="md" onClick={handleSave}>
          Salvar Alterações
        </Button>
      </div>
    </Modal>
  );
}