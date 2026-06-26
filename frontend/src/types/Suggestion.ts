import type { QualisEstrato } from './Magazine';

export type SuggestionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Suggestion {
  id: number;
  name: string;
  issn: string;
  officialLink: string;
  knowledgeArea: string;
  qualis: QualisEstrato;
  hasFee: boolean;
  description?: string | null;
  status: SuggestionStatus;
  contributorId: number;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
