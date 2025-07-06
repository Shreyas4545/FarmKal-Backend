export class TimeUtils {
  static getTimeDifferenceInMinutes(time1: string, time2: string): number {
    const parseTime = (str: string): number => {
      const [hours, minutes] = str.split(':').map(Number);
      return hours * 60 + minutes;
    };
    return Math.abs(parseTime(time2) - parseTime(time1));
  }

  static formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  }
}
