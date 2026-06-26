import Category, { CategoryAttributes } from './category.model';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return Category.findAll({ order: [['name', 'ASC']] });
  }

  async findById(id: number): Promise<Category | null> {
    return Category.findByPk(id);
  }

  async findByName(name: string): Promise<Category | null> {
    return Category.findOne({ where: { name } });
  }

  async create(data: CategoryAttributes): Promise<Category> {
    return Category.create(data);
  }

  async delete(id: number): Promise<void> {
    await Category.destroy({ where: { id } });
  }

  async count(): Promise<number> {
    return Category.count();
  }
}
