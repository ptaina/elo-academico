// backend/src/modules/suggestions/suggestion.repository.ts

import Suggestion, { SuggestionAttributes, SuggestionStatus } from './suggestion.model';

export class SuggestionRepository {
  async create(data: SuggestionAttributes): Promise<Suggestion> {
    return Suggestion.create(data);
  }

  // MUDANÇA: status como null significa "buscar todos" — sem undefined
  async findAll(status: SuggestionStatus | null): Promise<Suggestion[]> {
    const where = status ? { status } : {};
    return Suggestion.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByContributorId(contributorId: number): Promise<Suggestion[]> {
    return Suggestion.findAll({
      where: { contributorId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<Suggestion | null> {
    return Suggestion.findByPk(id);
  }

  // MUDANÇA: rejectionReason como null significa "sem motivo" — sem undefined
  async updateStatus(
    id:              number,
    status:          SuggestionStatus,
    rejectionReason: string | null,
  ): Promise<void> {
    await Suggestion.update(
      { status, rejectionReason },
      { where: { id } },
    );
  }

  async countPending(): Promise<number> {
    return Suggestion.count({ where: { status: SuggestionStatus.PENDING } });
  }
}