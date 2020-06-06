/**
 * Handles the conversion of timestamps received from the Discord API into UNIX timestamps
 * @class
 */
class Timestamp {
  public date: string | undefined;

  constructor(date: string | undefined) {
    this.date = date;
  }

  public unix(): number | undefined {
    return this.date ? Date.parse(this.date) : undefined;
  }
}

export default Timestamp;
