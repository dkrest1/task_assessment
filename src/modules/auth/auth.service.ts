import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../common/utils/helper.util';
import { User } from '../users/entities/user.entity';
import { LoginResponseI } from '../common/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user || !(await comparePassword(password, user.password))) {
        throw new BadRequestException('Invalid Credentials');
      }
      if (user && (await comparePassword(password, user.password))) {
        // delete password before returning user
        delete user.password;
        return user;
      }
      return null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    try {
      const user = await this.usersService.create(createAuthDto);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(user: User): Promise<LoginResponseI> {
    try {
      const payload = {
        sub: user.id,
        email: user.email,
      };
      const access_token = await this.jwtService.signAsync(payload);
      const response = {
        user,
        access_token,
      };
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
