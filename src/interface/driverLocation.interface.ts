export interface IDriverLocation {
  diaryId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  bearing?: number;
  createdAt?: Date;
}
