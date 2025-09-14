import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionsService } from '../service/transactions/transactions.service';

interface LocationData {
  diaryId: string;
  driverId: string;
  driverEntryId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  bearing?: number;
  ownerId?: string;
  customerId?: string;
  timestamp?: Date;
}

interface DriverRoom {
  driverId: string;
  ownerId: string;
  diaryId: string;
  socketId: string;
}

@WebSocketGateway({
  port: 9000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class LocationTrackingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(LocationTrackingGateway.name);

  // Track active drivers and their associated owners
  private activeDrivers: Map<string, DriverRoom> = new Map();
  private ownerSockets: Map<string, Set<string>> = new Map(); // ownerId -> Set of socketIds
  private driverSubscriptions: Map<string, Set<string>> = new Map(); // driverId -> Set of ownerIds

  constructor(private readonly transactionsService: TransactionsService) {}

  afterInit(server: Server) {
    this.logger.log('Location Tracking WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('CLIENT CONNECTED:', client.id);

    // Emit connected event with a small delay to ensure client is ready
    setTimeout(() => {
      client.emit('connected', {
        socketId: client.id,
        message: 'Connected to location tracking service',
      });
    }, 100);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from location tracking: ${client.id}`);

    // Clean up driver tracking
    for (const [driverId, room] of this.activeDrivers.entries()) {
      if (room.socketId === client.id) {
        this.activeDrivers.delete(driverId);
        // Notify ALL subscribed owners that driver went offline
        const subscribedOwners = this.driverSubscriptions.get(driverId);
        if (subscribedOwners) {
          for (const ownerId of subscribedOwners) {
            this.notifyOwnerDriverOffline(ownerId, driverId);
          }
          // Clean up driver subscriptions
          this.driverSubscriptions.delete(driverId);
        }
        break;
      }
    }

    // Clean up owner sockets
    for (const [ownerId, sockets] of this.ownerSockets.entries()) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.ownerSockets.delete(ownerId);
      }
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    console.log('Correct');
    client.emit('pong', {
      message: 'WebSocket is working',
      timestamp: new Date(),
      socketId: client.id,
    });
  }

  @SubscribeMessage('join-as-driver')
  async handleDriverJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driverId: string; ownerId: string; diaryId: string },
  ) {
    const { driverId, ownerId, diaryId } = data;

    // Join driver to their specific room
    const roomName = `driver-${driverId}`;
    await client.join(roomName);

    // Store driver info
    this.activeDrivers.set(driverId, {
      driverId,
      ownerId,
      diaryId,
      socketId: client.id,
    });

    // Automatically subscribe the primary owner to this driver
    if (!this.driverSubscriptions.has(driverId)) {
      this.driverSubscriptions.set(driverId, new Set());
    }
    this.driverSubscriptions.get(driverId)!.add(ownerId);

    // Notify owner that driver is online
    this.notifyOwnerDriverOnline(ownerId, driverId);

    client.emit('driver-joined', {
      driverId,
      room: roomName,
      message: 'Successfully joined as driver for location tracking',
    });

    this.logger.log(
      `Driver ${driverId} joined location tracking for diary ${diaryId}`,
    );
  }

  @SubscribeMessage('join-as-owner')
  async handleOwnerJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ownerId: string },
  ) {
    const { ownerId } = data;

    // Join owner to their specific room
    const roomName = `owner-${ownerId}`;
    await client.join(roomName);

    // Track owner socket
    if (!this.ownerSockets.has(ownerId)) {
      this.ownerSockets.set(ownerId, new Set());
    }
    this.ownerSockets.get(ownerId)!.add(client.id);

    client.emit('owner-joined', {
      ownerId,
      room: roomName,
      message: 'Successfully joined as owner for location tracking',
    });

    this.logger.log(`Owner ${ownerId} joined location tracking`);
  }

  @SubscribeMessage('location-update')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() locationData: any,
  ) {
    try {
      // Validate required fields
      if (
        !locationData.driverId ||
        !locationData.latitude ||
        !locationData.longitude
      ) {
        client.emit('error', { message: 'Missing required location data' });
        return;
      }

      // Add timestamp if not provided
      if (!locationData.timestamp) {
        locationData.timestamp = new Date();
      }

      // Store location in database (replacing Ably's addDriverLocation call)
      await this.transactionsService.addDriverLocation({
        diaryId: locationData.diaryId,
        driverId: locationData.driverId,
        driverEntryId: locationData.driverEntryId,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        speed: locationData?.speed,
        bearing: locationData?.bearing,
        createdAt: new Date(),
      });

      // Get driver room info
      const driverRoom = this.activeDrivers.get(locationData.driverId);
      if (!driverRoom) {
        client.emit('error', { message: 'Driver not properly registered' });
        return;
      }

      // Broadcast location to ALL owners subscribed to this driver
      const subscribedOwners = this.driverSubscriptions.get(
        locationData?.driverId,
      );
      if (subscribedOwners && subscribedOwners.size > 0) {
        for (const ownerId of subscribedOwners) {
          const ownerRoom = `owner-${ownerId}`;
          this.server.to(ownerRoom).emit('driver-location-update', {
            driverId: locationData?.driverId,
            diaryId: driverRoom?.diaryId,
            latitude: locationData?.latitude,
            driverEntryId: locationData.driverEntryId,
            longitude: locationData?.longitude,
            speed: locationData?.speed,
            bearing: locationData?.bearing,
            timestamp: locationData?.timestamp,
          });
        }
        this.logger.debug(
          `Location broadcasted to ${subscribedOwners.size} owners for driver ${locationData.driverId}`,
        );
      } else {
        this.logger.warn(
          `No owners subscribed to driver ${locationData.driverId}`,
        );
      }

      // Acknowledge successful location update
      client.emit('location-update-ack', {
        success: true,
        timestamp: locationData.timestamp,
      });

      this.logger.debug(`Location updated for driver ${locationData.driverId}`);
    } catch (error) {
      this.logger.error(`Error handling location update: ${error.message}`);
      client.emit('error', { message: 'Failed to process location update' });
    }
  }

  @SubscribeMessage('request-driver-locations')
  async handleLocationRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { driverId: string; diaryId: string; driverEntryId?: string },
  ) {
    try {
      const { driverId, diaryId, driverEntryId } = data;

      // Fetch historical locations from database
      const locationHistory =
        await this.transactionsService.getDriverLocationEntries(
          diaryId,
          driverId,
          driverEntryId,
        );

      client.emit('driver-locations-history', {
        driverId,
        diaryId,
        locations: locationHistory.data || [],
      });
    } catch (error) {
      this.logger.error(`Error fetching location history: ${error.message}`);
      client.emit('error', { message: 'Failed to fetch location history' });
    }
  }

  @SubscribeMessage('subscribe-to-driver')
  async handleSubscribeToDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ownerId: string; driverId: string },
  ) {
    const { ownerId, driverId } = data;

    // Add owner to driver's subscription list
    if (!this.driverSubscriptions.has(driverId)) {
      this.driverSubscriptions.set(driverId, new Set());
    }
    this.driverSubscriptions.get(driverId)!.add(ownerId);

    client.emit('subscribed-to-driver', {
      ownerId,
      driverId,
      message: 'Successfully subscribed to driver',
    });

    this.logger.log(`Owner ${ownerId} subscribed to driver ${driverId}`);
  }

  @SubscribeMessage('unsubscribe-from-driver')
  async handleUnsubscribeFromDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ownerId: string; driverId: string },
  ) {
    const { ownerId, driverId } = data;

    // Remove owner from driver's subscription list
    if (this.driverSubscriptions.has(driverId)) {
      this.driverSubscriptions.get(driverId)!.delete(ownerId);
      if (this.driverSubscriptions.get(driverId)!.size === 0) {
        this.driverSubscriptions.delete(driverId);
      }
    }

    client.emit('unsubscribed-from-driver', {
      ownerId,
      driverId,
      message: 'Successfully unsubscribed from driver',
    });

    this.logger.log(`Owner ${ownerId} unsubscribed from driver ${driverId}`);
  }

  // Helper method to notify owner when driver comes online
  private notifyOwnerDriverOnline(ownerId: string, driverId: string) {
    const ownerRoom = `owner-${ownerId}`;
    this.server.to(ownerRoom).emit('driver-online', {
      driverId,
      status: 'online',
      timestamp: new Date(),
    });
  }

  // Helper method to notify owner when driver goes offline
  private notifyOwnerDriverOffline(ownerId: string, driverId: string) {
    const ownerRoom = `owner-${ownerId}`;
    this.server.to(ownerRoom).emit('driver-offline', {
      driverId,
      status: 'offline',
      timestamp: new Date(),
    });
  }

  // Public method to get active drivers (for API endpoints)
  getActiveDrivers(): string[] {
    return Array.from(this.activeDrivers.keys());
  }

  // Public method to check if driver is online
  isDriverOnline(driverId: string): boolean {
    return this.activeDrivers.has(driverId);
  }
}
