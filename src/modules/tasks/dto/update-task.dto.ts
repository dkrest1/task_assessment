import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsIn(['pending', 'inProgress', 'completed'])
  status: string;
}
