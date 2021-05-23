import {
  Table,
  Column,
  Model,
  DataType,
  IsEmail,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import Role from './role.model';

@Table
class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({ unique: true, allowNull: false })
  username: string;

  @IsEmail
  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Role)
  @Column
  roleId: number;
}

export default User;
