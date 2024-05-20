import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string;
}
