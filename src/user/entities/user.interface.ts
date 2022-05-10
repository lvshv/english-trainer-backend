import { Role } from './role.enum';

export interface IUser {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  password: string;
}
