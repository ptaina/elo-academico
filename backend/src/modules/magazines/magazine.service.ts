import { MagazineRepository, MagazineSearchFilters } from './magazine.repository';
import { AppError } from '../../shared/AppError';
import { isNotEmpty, isValidISSN } from '../../utils/validators';
import logger from '../../utils/logger';

// SOLID - DIP: MagazineService depende da abstração MagazineRepository
export class MagazineService {
  constructor(private readonly magazineRepository: MagazineRepository) {}

  async findAll(filters: MagazineSearchFilters): Promise<object[]> {
    return this.magazineRepository.findAll(filters);
  }

  async findById(id: number): Promise<object | null> {
    return this.magazineRepository.findById(id);
  }

  async create(data: {
    name: string;
    issn: string;
    officialLink: string;
    knowledgeArea: string;
    qualis: string;
    hasFee: boolean;
    description?: string;
  }): Promise<object> {
    if (!isNotEmpty(data.name))          throw new AppError('Nome é obrigatório', 400);
    if (!isNotEmpty(data.issn))          throw new AppError('ISSN é obrigatório', 400);
    if (!isNotEmpty(data.officialLink))  throw new AppError('Link oficial é obrigatório', 400);
    if (!isNotEmpty(data.knowledgeArea)) throw new AppError('Área do conhecimento é obrigatória', 400);
    if (!isNotEmpty(data.qualis))        throw new AppError('Qualis é obrigatório', 400);

    if (!isValidISSN(data.issn)) throw new AppError('ISSN inválido', 400);

    const existing = await this.magazineRepository.findByISSN(data.issn);
    if (existing) throw new AppError('ISSN já cadastrado', 409);

    const magazine = await this.magazineRepository.create({
      name:          data.name.trim(),
      issn:          data.issn.toUpperCase().trim(),
      officialLink:  data.officialLink.trim(),
      knowledgeArea: data.knowledgeArea.trim(),
      qualis:        data.qualis as never,
      hasFee:        data.hasFee,
      description:   data.description?.trim() || null,
    });

    logger.info(`Revista cadastrada: ${magazine.name} | ISSN: ${magazine.issn}`);
    return magazine;
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      issn: string;
      officialLink: string;
      knowledgeArea: string;
      qualis: string;
      hasFee: boolean;
      description: string;
      isActive: boolean;
    }>
  ): Promise<void> {
    const magazine = await this.magazineRepository.findById(id);
    if (!magazine) throw new AppError('Revista não encontrada', 404);

    if (data.issn && data.issn !== magazine.issn) {
      if (!isValidISSN(data.issn)) throw new AppError('ISSN inválido', 400);
      const existing = await this.magazineRepository.findByISSN(data.issn);
      if (existing) throw new AppError('ISSN já cadastrado', 409);
    }

    await this.magazineRepository.update(id, data as never);
    logger.info(`Revista atualizada: ID ${id}`);
  }

  async delete(id: number): Promise<void> {
    const magazine = await this.magazineRepository.findById(id);
    if (!magazine) throw new AppError('Revista não encontrada', 404);

    await this.magazineRepository.delete(id);
    logger.info(`Revista removida: ID ${id}`);
  }
}
