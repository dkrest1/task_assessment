import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { localAuthGuard } from './guards/local-auth.guard';
import { APIResponseI } from '../common/interfaces/general.interface';

@ApiTags('api/auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiBody({ type: [CreateAuthDto] })
  @ApiResponse({
    status: 201,
    description: 'Created Successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createAuthDto: CreateAuthDto): Promise<APIResponseI> {
    const user = await this.authService.create(createAuthDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Created Successfully',
      payload: user,
    };
  }

  @UseGuards(localAuthGuard)
  @ApiBody({ type: [LoginAuthDto] })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  async login(@Request() req: any): Promise<APIResponseI> {
    const response = await this.authService.login(req.user);
    return {
      status: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }
}
