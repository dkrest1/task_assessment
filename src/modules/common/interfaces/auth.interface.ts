import { User } from 'src/modules/users/entities/user.entity';

export interface LoginResponseI {
  user: User;
  access_token: string;
}
