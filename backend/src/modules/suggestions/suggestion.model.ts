import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import { QualisClassification } from '../magazines/magazine.model';

export enum SuggestionStatus {
  PENDING  = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface SuggestionAttributes {
  id?: number;
  name: string;
  issn: string;
  officialLink: string;
  knowledgeArea: string;
  qualis: QualisClassification;
  hasFee: boolean;
  description?: string | null;
  status?: SuggestionStatus;
  contributorId: number;
  rejectionReason?: string | null;
}

class Suggestion extends Model<SuggestionAttributes> implements SuggestionAttributes {
  public id!: number;
  public name!: string;
  public issn!: string;
  public officialLink!: string;
  public knowledgeArea!: string;
  public qualis!: QualisClassification;
  public hasFee!: boolean;
  public description!: string | null;
  public status!: SuggestionStatus;
  public contributorId!: number;
  public rejectionReason!: string | null;
}

Suggestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    issn: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    officialLink: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    knowledgeArea: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    qualis: {
      type: DataTypes.ENUM(...Object.values(QualisClassification)),
      allowNull: false,
    },
    hasFee: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SuggestionStatus)),
      allowNull: false,
      defaultValue: SuggestionStatus.PENDING,
    },
    contributorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'suggestions',
    timestamps: true,
  }
);

export default Suggestion;
