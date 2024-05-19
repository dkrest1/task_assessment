import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../common/utils/helper.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // check if email existed
      const emailExist = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (emailExist) {
        throw new HttpException(
          'User with email existed',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = await hashPassword(createUserDto.password);
      const user = { ...createUserDto, password: hashedPassword };
      const createdUser = await this.userRepository.save(
        this.userRepository.create(user),
      );
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        id: userId,
      });

      if (!user || user === null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        email,
      });

      if (!user || user === null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        id: userId,
      });

      if (!user || user === null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const userToUpdate = {
        ...user,
        ...updateUserDto,
      };

      const updatedUser = await this.userRepository.save(userToUpdate);
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(userId: string): Promise<string> {
    try {
      const user = await this.userRepository.findOneBy({
        id: userId,
      });

      if (!user || user === null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.delete({ id: userId });

      return `User deleted successfully`;
    } catch (error) {
      throw new Error(error);
    }
  }
}
