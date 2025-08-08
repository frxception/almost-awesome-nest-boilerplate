import type { RoleType } from '../../../constants/role-type.ts';

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string | null;
  lastName: string | null;
  role: RoleType;
  email: string | null;
  password: string | null;
  phone: string | null;
  avatar: string | null;
}
