import { Op } from 'sequelize';
import Magazine, { MagazineAttributes, QUALIS_ORDER } from './magazine.model';

export interface MagazineSearchFilters {
  search?: string;
  knowledgeArea?: string;
  qualis?: string;
  hasFee?: boolean;
}

export class MagazineRepository {
  async findAll(filters: MagazineSearchFilters = {}): Promise<Magazine[]> {
    const where: Record<string, unknown> = { isActive: true };

    if (filters.knowledgeArea) {
      where['knowledgeArea'] = filters.knowledgeArea;
    }
    if (filters.qualis) {
      where['qualis'] = filters.qualis;
    }
    if (filters.hasFee !== undefined) {
      where['hasFee'] = filters.hasFee;
    }
    if (filters.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { qualis: { [Op.like]: `%${filters.search}%` } },
        { knowledgeArea: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    const magazines = await Magazine.findAll({ where });

    // Ordena por Qualis do melhor para o pior
    return magazines.sort((a, b) => {
      const orderA = QUALIS_ORDER[a.qualis] ?? 99;
      const orderB = QUALIS_ORDER[b.qualis] ?? 99;
      return orderA - orderB;
    });
  }

  async findById(id: number): Promise<Magazine | null> {
    return Magazine.findByPk(id);
  }

  async findByISSN(issn: string): Promise<Magazine | null> {
    return Magazine.findOne({ where: { issn } });
  }

  async create(data: MagazineAttributes): Promise<Magazine> {
    return Magazine.create(data);
  }

  async update(id: number, data: Partial<MagazineAttributes>): Promise<void> {
    await Magazine.update(data, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await Magazine.destroy({ where: { id } });
  }

  async count(): Promise<number> {
    return Magazine.count({ where: { isActive: true } });
  }
}
