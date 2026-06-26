export type QualisEstrato = 'A1' | 'A2' | 'A3' | 'A4' | 'B1' | 'B2' | 'B3' | 'B4' | 'C';

export interface Magazine {
  id: number;
  name: string;
  issn: string;
  officialLink: string;
  knowledgeArea: string;
  qualis: QualisEstrato;
  hasFee: boolean;
  description?: string | null;
  isActive?: boolean;
}
