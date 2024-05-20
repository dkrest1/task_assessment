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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { localAuthGuard } from './guards/local-auth.guard';
import { APIResponseI } from '../common/interfaces/general.interface';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiBody({ type: [CreateAuthDto] })
  @ApiResponse({
    status: 201,
    description: 'Create User',
    schema: {
      example: {
        statusCode: HttpStatus.CREATED,
        message: 'Created Successfully',
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
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createAuthDto: CreateAuthDto): Promise<APIResponseI> {
    const user = await this.authService.create(createAuthDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Successfully',
      payload: user,
    };
  }

  @UseGuards(localAuthGuard)
  @ApiOperation({ summary: 'Login a User' })
  @ApiBody({ type: [LoginAuthDto] })
  @ApiResponse({
    status: 200,
    description: 'Login User',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Success',
        payload: {
          user: {
            id: '123',
            email: 'example@example.com',
            username: 'example',
            fullname: 'example example',
            created_at: '2024-05-20T01:48:56.375Z',
            updated_at: '2024-05-20T01:48:56.375Z',
          },
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDkwYzcxMi04NWRjLTQ5MjEtYjFmOC1mNzBkYzc5MjI4YTUiLCJlbWFpbCI6ImRrcmVzdEBnbWFpbC5jb20iLCJpYXQiOjE3MTYxNjk4NTgsImV4cCI6MTcxNjE3NzA1OH0.dFhLVY_VlTfSBzEMLFaqhh0oD-ROsjfWBB94-WjtFqY',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Request() req: any,
  ): Promise<APIResponseI> {
    const response = await this.authService.login(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      payload: response,
    };
  }
}
