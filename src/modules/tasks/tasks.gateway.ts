import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class TasksGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  connectedClients: { [clientId: string]: string } = {};

  constructor(private readonly tasksService: TasksService) {}

  handleConnection(client: Socket) {
    const user = client.handshake.auth.user;
    if (user) {
      this.connectedClients[client.id] = user.id;
      console.log(`Client connected: ${client.id} (user: ${user.id})`);
    } else {
      console.log('Client connected:', client.id);
    }
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(
    @MessageBody() createTaskDto: CreateTaskDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.connectedClients[client.id];
    if (user) {
      const task = await this.tasksService.create(user, createTaskDto);
      client.emit('taskCreated', task);
      return task;
    } else {
      console.error('Client attempted to create task without a valid user ID');
      return null;
    }
  }

  @SubscribeMessage('updateTask')
  async handleUpdateTask(
    @MessageBody() data: { taskId: string; updateTaskDto: UpdateTaskDto },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.connectedClients[client.id];
    if (user) {
      const task = await this.tasksService.update(
        user,
        data.taskId,
        data.updateTaskDto,
      );
      client.emit('taskUpdated', task);
      return task;
    } else {
      console.error('Client attempted to update task without a valid user ID');
      return null;
    }
  }
}
