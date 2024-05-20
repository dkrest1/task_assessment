import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@WebSocketGateway()
export class AuthGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  connectedClients: { [clientId: string]: string } = {};

  constructor(private readonly authService: AuthService) {}

  handleConnection(client: Socket) {
    const user = client.handshake.auth.user;
    if (user) {
      this.connectedClients[client.id] = user.id;
      console.log(`Client connected: ${client.id} (user: ${user.id})`);
    } else {
      console.log('Client connected:', client.id);
    }
  }

  @SubscribeMessage('createUser')
  async handleCreateUser(
    @MessageBody() createAuthDto: CreateAuthDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.authService.create(createAuthDto);
    client.emit('userCreated', user);
    return user;
  }
}
