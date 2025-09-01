export class TimeUtils {
  static getTimeDifferenceInMinutes(
    startTime: string | Date,
    endTime: string | Date,
  ): number {
    // Parse into Date objects
    const start =
      typeof startTime === 'string' ? new Date(startTime) : startTime;
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;

    // Compute difference in milliseconds
    const diffMs = Math.abs(end.getTime() - start.getTime());

    // Convert to total minutes
    return Math.floor(diffMs / (1000 * 60));
  }

  static formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  }

  static calculateRate(ratePerHour: number, totalMinutes: number) {
    console.log(ratePerHour, totalMinutes);
    if (!ratePerHour || !totalMinutes) return 0;

    const ratePerMinute = ratePerHour / 60;
    return Math.round(ratePerMinute * totalMinutes);
  }

  static timeToMinutes(timeStr: string) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
