import { Injectable, Logger } from '@nestjs/common';
import { LocationTrackingGateway } from '../../utils/location-tracking.gateway';

@Injectable()
export class LocationTrackingService {
  private readonly logger = new Logger(LocationTrackingService.name);

  constructor(private readonly locationGateway: LocationTrackingGateway) {}

  /**
   * Replacement for Ably's publishSubscribe functionality
   * This method can be called from controllers to broadcast location updates
   */
  async broadcastLocationUpdate(locationData: {
    driverId: string;
    ownerId: string;
    latitude: number;
    longitude: number;
    diaryId?: string;
    speed?: number;
    bearing?: number;
  }) {
    try {
      // Emit to owner's room directly
      const ownerRoom = `owner-${locationData.ownerId}`;
      this.locationGateway.server.to(ownerRoom).emit('driver-location-update', {
        driverId: locationData.driverId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        speed: locationData.speed,
        bearing: locationData.bearing,
        timestamp: new Date(),
      });

      this.logger.log(
        `Location broadcasted for driver ${locationData.driverId} to owner ${locationData.ownerId}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to broadcast location: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get list of currently active drivers
   */
  getActiveDrivers(): string[] {
    return this.locationGateway.getActiveDrivers();
  }

  /**
   * Check if a specific driver is currently online
   */
  isDriverOnline(driverId: string): boolean {
    return this.locationGateway.isDriverOnline(driverId);
  }

  /**
   * Send notification to driver about tracking request
   */
  async notifyDriverTrackingRequest(
    driverId: string,
    ownerName: string,
    diaryId: string,
  ) {
    try {
      const driverRoom = `driver-${driverId}`;
      this.locationGateway.server.to(driverRoom).emit('tracking-request', {
        ownerName,
        diaryId,
        message: `${ownerName} has requested to track your location`,
        timestamp: new Date(),
      });

      this.logger.log(
        `Tracking request sent to driver ${driverId} from ${ownerName}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send tracking request: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
