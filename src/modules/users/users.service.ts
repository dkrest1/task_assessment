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
    // check if email existed
    const emailExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
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
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user || user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const userToUpdate = {
      ...user,
      ...updateUserDto,
    };

    const updatedUser = await this.userRepository.save(userToUpdate);
    return updatedUser;
  }

  async delete(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete({ id: userId });

    return `User deleted successfully`;
  }
}
