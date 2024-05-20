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
    const user = await this.usersService.findOne(userId);
    const newTask = await this.taskRepository.save(
      this.taskRepository.create({ ...createTaskDto, userId: user }),
    );
    return newTask;
  }

  async findOne(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['userId'],
    });
    if (!task || task === null) {
      throw new HttpException('task does not exist', HttpStatus.NOT_FOUND);
    }
    delete task.userId.password;
    return task;
  }

  async findUserTasks(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Task[]> {
    const user = await this.usersService.findOne(userId);

    const tasks = await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.userId', 'userId')
      .where('tasks.userId = :userId', { userId: user.id })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    if (tasks.length === 0) {
      throw new HttpException('Tasks do not exist', HttpStatus.NOT_FOUND);
    }

    return tasks;
  }

  async update(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const user = await this.usersService.findOne(userId);

    const task = await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.userId', 'userId')
      .where('tasks.id = :taskId', { taskId })
      .andWhere('tasks.userId = :userId', { userId: user.id })
      .getOne();

    const taskToUpdate = { ...task, ...updateTaskDto };
    const updatedPost = await this.taskRepository.save(taskToUpdate);
    return updatedPost;
  }

  async delete(userId: string, taskId: string): Promise<string> {
    const user = await this.usersService.findOne(userId);

    const task = await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.userId', 'userId')
      .where('tasks.id = :taskId', { taskId })
      .andWhere('tasks.userId = :userId', { userId: user.id })
      .getOne();

    if (!task || task === null) {
      throw new HttpException('task does not exist', HttpStatus.NOT_FOUND);
    }
    await this.taskRepository.delete(taskId);
    return `Task deleted successfully`;
  }
}
