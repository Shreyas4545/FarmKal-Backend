import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients: Set<Socket> = new Set();

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.add(client);
    client.emit('clientConnected', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  @SubscribeMessage('messageFromClient1')
  handleMessageFromClient1(client: Socket, payload: any): void {
    payload = JSON.parse(payload);
    console.log(`Message from client ${client.id}: ${payload.receiver}`);
    this.server.emit(`${payload.receiver}`, payload?.message);
  }

  @SubscribeMessage('messageFromClient2')
  handleMessageFromClient2(client: Socket, payload: any): void {
    payload = JSON.parse(payload);
    console.log(`Message from client ${client.id}: ${payload}`);
    this.server.emit(`${payload.receiver}`, payload?.message);
  }
}
