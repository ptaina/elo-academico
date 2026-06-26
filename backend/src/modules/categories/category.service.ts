import { CategoryRepository } from './category.repository';
import { AppError } from '../../shared/AppError';
import { isNotEmpty } from '../../utils/validators';
import logger from '../../utils/logger';

// SOLID - DIP: CategoryService depende da abstração CategoryRepository
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<object[]> {
    return this.categoryRepository.findAll();
  }

  async create(name: string): Promise<object> {
    if (!isNotEmpty(name)) throw new AppError('Nome da categoria é obrigatório', 400);

    const existing = await this.categoryRepository.findByName(name.trim());
    if (existing) throw new AppError('Categoria já cadastrada', 409);

    const category = await this.categoryRepository.create({ name: name.trim() });
    logger.info(`Categoria criada: ${category.name}`);
    return category;
  }

  async delete(id: number): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new AppError('Categoria não encontrada', 404);

    await this.categoryRepository.delete(id);
    logger.info(`Categoria removida: ID ${id}`);
  }
}
