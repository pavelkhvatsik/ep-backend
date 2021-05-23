import { ERole } from '../enums/user.enums';

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  roleId: number;
  role?: ERole;
}
