// backend/src/modules/suggestions/suggestion.service.ts
//
// MUDANÇA: o método approve agora também cria um registro
// na tabela de revistas com os dados da sugestão aprovada.
// SOLID - DIP: MagazineRepository é injetado pelo construtor.

import { SuggestionRepository } from './suggestion.repository';
import { SuggestionStatus }     from './suggestion.model';
import { MagazineRepository }   from '../magazines/magazine.repository';
import { AppError }             from '../../shared/AppError';
import { isNotEmpty, isValidISSN } from '../../utils/validators';
import logger                   from '../../utils/logger';

export class SuggestionService {
  constructor(
    private readonly suggestionRepository: SuggestionRepository,
    // Injetado para criar a revista quando a sugestão for aprovada
    private readonly magazineRepository: MagazineRepository,
  ) {}

  async create(data: {
    name:          string;
    issn:          string;
    officialLink:  string;
    knowledgeArea: string;
    qualis:        string;
    hasFee:        boolean;
    description:   string | null;
    contributorId: number;
  }): Promise<object> {
    if (!isNotEmpty(data.name))          throw new AppError('Nome é obrigatório', 400);
    if (!isNotEmpty(data.issn))          throw new AppError('ISSN é obrigatório', 400);
    if (!isNotEmpty(data.officialLink))  throw new AppError('Link oficial é obrigatório', 400);
    if (!isNotEmpty(data.knowledgeArea)) throw new AppError('Área do conhecimento é obrigatória', 400);
    if (!isNotEmpty(data.qualis))        throw new AppError('Qualis é obrigatório', 400);

    if (!isValidISSN(data.issn)) throw new AppError('ISSN inválido', 400);

    const suggestion = await this.suggestionRepository.create({
      name:          data.name.trim(),
      issn:          data.issn.toUpperCase().trim(),
      officialLink:  data.officialLink.trim(),
      knowledgeArea: data.knowledgeArea.trim(),
      qualis:        data.qualis as never,
      hasFee:        data.hasFee,
      description:   data.description ? data.description.trim() : null,
      contributorId: data.contributorId,
    });

    logger.info(`Sugestão enviada: ${suggestion.name} | Contribuidor: ${data.contributorId}`);
    return suggestion;
  }

  async findAll(status: string): Promise<object[]> {
    if (status && Object.values(SuggestionStatus).includes(status as SuggestionStatus)) {
      return this.suggestionRepository.findAll(status as SuggestionStatus);
    }
    return this.suggestionRepository.findAll(null);
  }

  async findById(id: number): Promise<object | null> {
    return this.suggestionRepository.findById(id);
  }

  async findByContributor(contributorId: number): Promise<object[]> {
    return this.suggestionRepository.findByContributorId(contributorId);
  }

  async approve(id: number): Promise<void> {
    const suggestion = await this.suggestionRepository.findById(id);
    if (!suggestion) throw new AppError('Sugestão não encontrada', 404);
    if (suggestion.status !== SuggestionStatus.PENDING)
      throw new AppError('Sugestão já foi processada', 400);

    // Verifica se já existe uma revista com o mesmo ISSN antes de criar
    const existing = await this.magazineRepository.findByISSN(suggestion.issn);
    if (!existing) {
      await this.magazineRepository.create({
        name:          suggestion.name,
        issn:          suggestion.issn,
        officialLink:  suggestion.officialLink,
        knowledgeArea: suggestion.knowledgeArea,
        qualis:        suggestion.qualis,
        hasFee:        suggestion.hasFee,
        description:   suggestion.description,
      });
      logger.info(`Revista criada a partir de sugestão aprovada: ${suggestion.name} | ISSN: ${suggestion.issn}`);
    }

    await this.suggestionRepository.updateStatus(id, SuggestionStatus.APPROVED, null);
    logger.info(`Sugestão aprovada: ID ${id}`);
  }

  async reject(id: number, reason: string): Promise<void> {
    if (!isNotEmpty(reason)) throw new AppError('Motivo da recusa é obrigatório', 400);

    const suggestion = await this.suggestionRepository.findById(id);
    if (!suggestion) throw new AppError('Sugestão não encontrada', 404);
    if (suggestion.status !== SuggestionStatus.PENDING)
      throw new AppError('Sugestão já foi processada', 400);

    await this.suggestionRepository.updateStatus(id, SuggestionStatus.REJECTED, reason);
    logger.info(`Sugestão recusada: ID ${id} | Motivo: ${reason}`);
  }
}