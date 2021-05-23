import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import User from './user.model';

@Table
class RefreshToken extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  token: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresIn: Date;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;
}

export default RefreshToken;
