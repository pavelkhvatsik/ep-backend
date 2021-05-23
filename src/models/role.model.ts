import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

import { ERole } from '../enums/user.enums';
import User from './user.model';

@Table
class Role extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: string;

  @Column({ unique: true, allowNull: false })
  name: ERole;

  @HasMany(() => User)
  users: User[];
}

export default Role;
