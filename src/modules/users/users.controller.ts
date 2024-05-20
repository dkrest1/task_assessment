import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { APIResponseI } from '../common/interfaces/general.interface';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find a User' })
  @ApiResponse({
    status: 200,
    description: 'Find a User',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Success',
        payload: {
          id: '123',
          email: 'example@example.com',
          username: 'example',
          fullname: 'example example',
          created_at: '2024-05-20T01:48:56.375Z',
          updated_at: '2024-05-20T01:48:56.375Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'userId' })
  @Get(':userId')
  async findOne(
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: string,
  ): Promise<APIResponseI> {
    const response = await this.usersService.findOne(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({
    status: 200,
    description: 'Update a User',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Success',
        payload: {
          id: '123',
          email: 'example@example.com',
          username: 'example',
          fullname: 'example example',
          created_at: '2024-05-20T01:48:56.375Z',
          updated_at: '2024-05-20T01:48:56.375Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'userId' })
  @ApiBody({ type: [UpdateUserDto] })
  @Patch(':userId')
  async update(
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<APIResponseI> {
    const response = await this.usersService.update(userId, updateUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({
    status: 200,
    description: 'Delete a User',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        payload: null,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'userId' })
  @Delete(':userId')
  async delete(
    @Param(
      'userId',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: string,
  ) {
    const response = await this.usersService.delete(userId);

    return {
      status: HttpStatus.OK,
      message: response,
      payload: null,
    };
  }
}
