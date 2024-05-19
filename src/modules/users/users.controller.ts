import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { APIResponseI } from '../common/interfaces/general.interface';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'pages number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<APIResponseI> {
    const response = await this.usersService.findAll(page, limit);

    return {
      status: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('me')
  async findOne(@Request() req: any): Promise<APIResponseI> {
    const userId = req.user.id;
    const response = await this.usersService.findOne(userId);

    return {
      status: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The User has successfully been updated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: [UpdateUserDto] })
  @Patch('me')
  async update(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<APIResponseI> {
    const userId = req.user.id;
    const response = await this.usersService.update(userId, updateUserDto);

    return {
      status: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('me')
  async delete(@Request() req: any) {
    const userId = req.user.id;
    const response = await this.usersService.delete(userId);

    return {
      status: HttpStatus.OK,
      message: response,
      payload: null,
    };
  }
}
