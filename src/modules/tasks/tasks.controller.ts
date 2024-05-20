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
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { APIResponseI } from '../common/interfaces/general.interface';

@ApiTags('tasks')
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
      statusCode: HttpStatus.CREATED,
      message: 'Task created successfully',
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
      statusCode: HttpStatus.OK,
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
  @ApiParam({ name: 'userId' })
  @ApiQuery({
    name: 'page',
    description: 'page number',
  })
  @ApiQuery({
    name: 'limit',
    description: 'the number of task per page',
  })
  @Get('users/:userId')
  async findUserTasks(
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<APIResponseI> {
    const response = await this.tasksService.findUserTasks(userId, page, limit);

    return {
      statusCode: HttpStatus.OK,
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
  @ApiParam({ name: 'taskId' })
  @ApiParam({ name: 'userId' })
  @ApiBody({ type: [UpdateTaskDto] })
  @Patch(':taskId/users/:userId')
  async update(
    @Param(
      'taskId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    taskId: string,
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<APIResponseI> {
    const response = await this.tasksService.update(
      userId,
      taskId,
      updateTaskDto,
    );
    return {
      statusCode: HttpStatus.OK,
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
  @ApiParam({ name: 'taskId' })
  @ApiParam({ name: 'userId' })
  @Delete(':taskId/users/:userId')
  async delete(
    @Param(
      'taskId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    taskId: string,
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: string,
  ): Promise<APIResponseI> {
    const response = await this.tasksService.delete(userId, taskId);

    return {
      statusCode: HttpStatus.OK,
      message: response,
      payload: null,
    };
  }
}
