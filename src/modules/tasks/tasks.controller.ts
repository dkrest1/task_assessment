import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ParseUUIDPipe,
  Query,
  HttpStatus,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { APIResponseI } from '../common/interfaces/general.interface';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Task created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: [CreateTaskDto] })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: any,
  ): Promise<APIResponseI> {
    const response = await this.tasksService.create(req.user.id, createTaskDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Task created successfully',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'page',
    description: 'page number',
  })
  @ApiQuery({
    name: 'limit',
    description: 'the number of task per page',
  })
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<APIResponseI> {
    const response = await this.tasksService.findAll(page, limit);
    return {
      status: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Success ',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'taskId' })
  @Get(':taskId')
  async findOne(
    @Param(
      'taskId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    taskId: string,
  ): Promise<APIResponseI> {
    const response = await this.tasksService.findOne(taskId);

    return {
      status: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Success ',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'me' })
  @Get('me')
  async findUserTasks(@Request() req: any): Promise<APIResponseI> {
    const userId = req.user.id;
    const response = await this.tasksService.findUserTasks(userId);

    return {
      status: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: [UpdateTaskDto] })
  @Patch(':taskId/me')
  async update(
    @Param(
      'taskId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    taskId: string,
    @Request() req: any,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<APIResponseI> {
    const userId: string = req.user.id;
    const response = await this.tasksService.update(
      userId,
      taskId,
      updateTaskDto,
    );
    return {
      status: HttpStatus.OK,
      message: 'Task updated successfully',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'TaskId' })
  @Delete(':taskId/me')
  async delete(
    @Param(
      'taskId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    taskId: string,
    @Request() req: any,
  ): Promise<APIResponseI> {
    const userId: string = req.user.id;
    const response = await this.tasksService.delete(userId, taskId);

    return {
      status: HttpStatus.OK,
      message: response,
      payload: null,
    };
  }
}
