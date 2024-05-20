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
  ApiOperation,
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
  @ApiOperation({ summary: 'Create a Task for a Logged in User' })
  @ApiResponse({
    status: 201,
    description: 'Create Task',
    schema: {
      example: {
        statusCode: HttpStatus.CREATED,
        message: 'Task created successfully.',
        payload: {
          title: 'example task',
          description: 'Task example',
          status: 'inProgress',
          userId: {
            id: '123abc',
            email: 'example@example.com',
            username: 'example',
            fullname: 'example',
            created_at: '2024-05-20T00:20:16.897Z',
            updated_at: '2024-05-20T00:20:16.897Z',
          },
          id: '123abc',
          created_at: '2024-05-20T01:59:33.270Z',
          updated_at: '2024-05-20T01:59:33.270Z',
        },
      },
    },
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
  @ApiOperation({ summary: 'Find a Task' })
  @ApiResponse({
    status: 200,
    description: 'Find a Task',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Success.',
        payload: {
          title: 'example task',
          description: 'Task example',
          status: 'inProgress',
          userId: {
            id: '123abc',
            email: 'example@example.com',
            username: 'example',
            fullname: 'example',
            created_at: '2024-05-20T00:20:16.897Z',
            updated_at: '2024-05-20T00:20:16.897Z',
          },
          id: '123abc',
          created_at: '2024-05-20T01:59:33.270Z',
          updated_at: '2024-05-20T01:59:33.270Z',
        },
      },
    },
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
  @ApiOperation({ summary: 'Get all Tasks for a User' })
  @ApiResponse({
    status: 200,
    description: 'Get all Tasks for a User',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Success.',
        payload: [
          {
            id: '123abc',
            title: 'Example Task',
            description: 'Task One',
            status: 'completed',
            created_at: '2024-05-20T01:18:30.847Z',
            updated_at: '2024-05-20T01:18:30.847Z',
            userId: {
              id: '123abc',
              email: 'example@example.com',
              username: 'example',
              fullname: 'example',
              created_at: '2024-05-20T00:20:16.897Z',
              updated_at: '2024-05-20T00:20:16.897Z',
            },
          },
          {
            id: '1123abc1',
            title: 'one',
            description: 'Task Two',
            status: 'inProgress',
            created_at: '2024-05-20T01:37:09.637Z',
            updated_at: '2024-05-20T01:37:09.637Z',
            userId: {
              id: '123abc',
              email: 'example1@example.com',
              username: 'example1',
              fullname: 'example1',
              created_at: '2024-05-20T00:20:16.897Z',
              updated_at: '2024-05-20T00:20:16.897Z',
            },
          },
        ],
      },
    },
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
  @ApiOperation({ summary: 'Update a single Task for a User' })
  @ApiResponse({
    status: 200,
    description: 'Get all Tasks for a User',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Task updated successfully',
        payload: {
          title: 'example task',
          description: 'Task example',
          status: 'inProgress',
          userId: {
            id: '123abc',
            email: 'example@example.com',
            username: 'example',
            fullname: 'example',
            created_at: '2024-05-20T00:20:16.897Z',
            updated_at: '2024-05-20T00:20:16.897Z',
          },
          id: '123abc',
          created_at: '2024-05-20T01:59:33.270Z',
          updated_at: '2024-05-20T01:59:33.270Z',
        },
      },
    },
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
  @ApiOperation({ summary: 'Delete a single Task for a User' })
  @ApiResponse({
    status: 200,
    description: 'Delete a single Task for a User',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Task deleted successfully',
        payload: null,
      },
    },
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
