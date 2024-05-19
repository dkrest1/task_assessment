import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  username: string;
}
