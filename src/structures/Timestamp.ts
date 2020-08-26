/**
 * Handles the conversion of timestamps received from the Discord API into UNIX timestamps
 */
export class Timestamp {
  /**
   * The ISO date of this timestamp
   */
  public date: string | undefined;

  constructor(date: string | number | Date | undefined) {
    if (typeof date === 'number') {
      this.date = new Date(date).toISOString();
    } else if (date instanceof Date) {
      this.date = date.toISOString();
    } else {
      this.date = date;
    }
  }

  public unix(): number | undefined {
    return this.date ? Date.parse(this.date) : undefined;
  }

  public ISO() {
    if (this.date) return new Date(this.unix()!).toISOString();
  }
}
