import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum QualisClassification {
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  B4 = 'B4',
  C  = 'C',
}

// Ordem para ranking Qualis — A1 é melhor
export const QUALIS_ORDER: Record<QualisClassification, number> = {
  A1: 0, A2: 1, A3: 2, A4: 3, B1: 4, B2: 5, B3: 6, B4: 7, C: 8,
};

export interface MagazineAttributes {
  id?: number;
  name: string;
  issn: string;
  officialLink: string;
  knowledgeArea: string;
  qualis: QualisClassification;
  hasFee: boolean;
  description?: string | null;
  isActive?: boolean;
}

class Magazine extends Model<MagazineAttributes> implements MagazineAttributes {
  public id!: number;
  public name!: string;
  public issn!: string;
  public officialLink!: string;
  public knowledgeArea!: string;
  public qualis!: QualisClassification;
  public hasFee!: boolean;
  public description!: string | null;
  public isActive!: boolean;
}

Magazine.init(
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
      unique: true,
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'magazines',
    timestamps: true,
  }
);

export default Magazine;
