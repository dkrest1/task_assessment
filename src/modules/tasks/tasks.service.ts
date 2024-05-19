import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const user = await this.usersService.findOne(userId);
      const newTask = await this.taskRepository.save(
        this.taskRepository.create({ ...createTaskDto, userId: user }),
      );
      return newTask;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(page: number, limit: number): Promise<Task[]> {
    try {
      const tasks = await this.taskRepository.find({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['userId'],
      });
      return tasks;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(taskId: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });
      if (!task || task === null) {
        throw new HttpException('task does not exist', HttpStatus.NOT_FOUND);
      }
      return task;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserTasks(userId: string): Promise<Task[]> {
    try {
      const user = await this.usersService.findOne(userId);
      const tasks = await this.taskRepository.find({
        where: { userId: user },
      });
      if (!tasks || tasks.length === 0) {
        throw new HttpException('Tasks do not exist', HttpStatus.NOT_FOUND);
      }

      return tasks;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .where(`task.id = :postId`, { taskId })
      .getOne();

    try {
      if (task.userId.id !== userId) {
        throw new HttpException(
          'user with task does not exist',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const PostToUpdate = { ...task, ...updateTaskDto };
      const updatedPost = await this.taskRepository.save(PostToUpdate);
      delete updatedPost.userId.password;
      return updatedPost;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(userId: string, taskId: string): Promise<string> {
    try {
      const task = await this.taskRepository
        .createQueryBuilder('tasks')
        .leftJoinAndSelect('tasks.userId', 'userId')
        .where(`tasks.id  = :id`, { taskId })
        .getOne();

      if (!task.userId || task.userId === null || task.userId.id !== userId) {
        throw new HttpException(
          'user with task does not exit',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (task === null || !task) {
        throw new HttpException('task does not exist', HttpStatus.NOT_FOUND);
      }
      await this.taskRepository.delete(taskId);
      return `Task deleted successfully`;
    } catch (error) {
      throw new Error(error);
    }
  }
}
