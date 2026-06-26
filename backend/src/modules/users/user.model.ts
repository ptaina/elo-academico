// backend/src/modules/users/user.model.ts
// MUDANÇA: removidos street, number, complement, neighborhood
// Ficam apenas os campos solicitados: name, email, password,
// cpf, phone, zipCode, city, state

import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export enum UserRole {
  SUPERADMIN  = 'SUPERADMIN',
  ADMIN       = 'ADMIN',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

export enum UserStatus {
  ACTIVE  = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface UserAttributes {
  id?:       number;
  name:      string;
  email:     string;
  password:  string;
  cpf?:      string | null;
  phone?:    string | null;
  zipCode?:  string | null;
  city?:     string | null;
  state?:    string | null;
  role:      UserRole;
  status?:   UserStatus;
  banReason?: string | null;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!:        number;
  public name!:      string;
  public email!:     string;
  public password!:  string;
  public cpf!:       string | null;
  public phone!:     string | null;
  public zipCode!:   string | null;
  public city!:      string | null;
  public state!:     string | null;
  public role!:      UserRole;
  public status!:    UserStatus;
  public banReason!: string | null;
}

User.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    name: {
      type:      DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type:      DataTypes.STRING(150),
      allowNull: false,
      unique:    true,
    },
    password: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    cpf: {
      type:      DataTypes.STRING(11),
      allowNull: true,
      unique:    true,
    },
    phone: {
      type:      DataTypes.STRING(11),
      allowNull: true,
    },
    zipCode: {
      type:      DataTypes.STRING(8),
      allowNull: true,
    },
    city: {
      type:      DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type:      DataTypes.STRING(2),
      allowNull: true,
    },
    role: {
      type:         DataTypes.ENUM(...Object.values(UserRole)),
      allowNull:    false,
      defaultValue: UserRole.CONTRIBUTOR,
    },
    status: {
      type:         DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull:    false,
      defaultValue: UserStatus.ACTIVE,
    },
    banReason: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName:  'users',
    timestamps: true,
  }
);

export default User;