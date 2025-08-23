export interface IDriverLocation {
  diaryId: string;
  driverId: string;
  latitude: number;
  driverEntryId: string;
  longitude: number;
  speed?: number;
  bearing?: number;
  createdAt?: Date;
}
