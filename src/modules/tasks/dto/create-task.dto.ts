import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'inProgress', 'completed'])
  status: string;
}
