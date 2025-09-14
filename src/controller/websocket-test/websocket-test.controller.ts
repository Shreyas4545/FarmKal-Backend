import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { LocationTrackingService } from '../../service/location-tracking/location-tracking.service';
import { ResponseCompo } from '../../utils/response';

@Controller('api/websocket-test')
export class WebSocketTestController {
  constructor(
    private readonly locationTrackingService: LocationTrackingService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Get('/status')
  async getWebSocketStatus(@Res() response) {
    try {
      const activeDrivers = this.locationTrackingService.getActiveDrivers();
      
      const status = {
        websocketEnabled: true,
        serverTime: new Date().toISOString(),
        activeDriversCount: activeDrivers.length,
        activeDrivers: activeDrivers,
        testUrls: {
          websocketUrl: 'ws://localhost:3000/location-tracking',
          testClient: 'http://localhost:3000/websocket-test-client.html',
        },
        sampleEvents: {
          joinAsDriver: {
            event: 'join-as-driver',
            data: {
              driverId: 'driver123',
              ownerId: 'owner456',
              diaryId: 'diary789'
            }
          },
          locationUpdate: {
            event: 'location-update',
            data: {
              driverId: 'driver123',
              diaryId: 'diary789',
              driverEntryId: 'entry456',
              latitude: 12.9716,
              longitude: 77.5946,
              speed: 45,
              bearing: 180
            }
          }
        }
      };

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'WebSocket service is running',
        },
        status,
      );
    } catch (err) {
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `WebSocket status check failed: ${err}`,
      });
    }
  }

  @Get('/driver-status/:driverId')
  async getDriverStatus(@Res() response, driverId: string) {
    try {
      const isOnline = this.locationTrackingService.isDriverOnline(driverId);
      
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: `Driver ${driverId} status retrieved`,
        },
        {
          driverId,
          isOnline,
          timestamp: new Date().toISOString(),
        },
      );
    } catch (err) {
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to get driver status: ${err}`,
      });
    }
  }
}
