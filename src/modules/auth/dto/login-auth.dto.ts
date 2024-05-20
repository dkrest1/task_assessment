import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
