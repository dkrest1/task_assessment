import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { APIResponseI } from '../common/interfaces/general.interface';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
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
