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

  /**
   * Returns the UNIX timestamp of this timestamp
   * @returns {number | undefined}
   */
  public unix(): number | undefined {
    return this.date ? Date.parse(this.date) : undefined;
  }

  /**
   * Returns the ISO date of this timestamp
   * @returns {string | undefined}
   */
  public get iso(): string | undefined {
    return this.date ? new Date(this.date).toISOString() : undefined;
  }
}
