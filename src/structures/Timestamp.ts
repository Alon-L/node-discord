/**
 * Handles the conversion of timestamps received from the Discord API into UNIX timestamps
 */
export class Timestamp {
  public date?: string;

  constructor(date: string | undefined | number | Date) {
    if (typeof date === 'number') this.date = new Date(date).toISOString();
    else if (date instanceof Date) this.date = date.toISOString();
    else this.date = date;
  }

  public unix(): number | undefined {
    return this.date ? Date.parse(this.date) : undefined;
  }

  public ISO() {
    if (this.date) return new Date(this.unix()!).toISOString();
  }
}
