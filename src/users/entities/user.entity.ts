import { auth } from '../../lib/auth';

export type UserBase = typeof auth.$Infer.Session.user;

export class UserEntity implements UserBase {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  email!: string;
  emailVerified!: boolean;
  name!: string;
  image?: string | null | undefined;
  role!: string;
}
