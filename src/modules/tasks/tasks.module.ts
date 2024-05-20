import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { TasksGateway } from './tasks.gateway';
@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService, JwtStrategy, TasksGateway],
  exports: [TasksService],
})
export class TasksModule {}
