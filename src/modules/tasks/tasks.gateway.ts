import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@WebSocketGateway()
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tasksService: TasksService) {}

  @SubscribeMessage('createTask')
  async handleCreateTask(@MessageBody() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    this.server.emit('taskCreated', task);
    return task;
  }

  @SubscribeMessage('updateTask')
  async handleUpdateTask(@MessageBody() updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksService.update(
      updateTaskDto.id,
      updateTaskDto,
    );
    this.server.emit('taskUpdated', task);
    return task;
  }

  @SubscribeMessage('deleteTask')
  async handleDeleteTask(@MessageBody() id: string) {
    await this.tasksService.delete(id);
    this.server.emit('taskDeleted', id);
  }
}
