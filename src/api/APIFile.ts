import fs from 'fs';
import fetch from 'node-fetch';
import { RequestFile } from './rateLimit';

/**
 * The type of the API file
 */
enum APIFileType {
  File,
  URL,
}

/**
 * Represents a file sent directly to the API
 */
export class APIFile {
  private readonly type: APIFileType;
  public readonly path: string;
  public readonly name: string;

  constructor(file: RequestFile) {
    if (typeof file === 'string') {
      this.type = APIFileType.URL;

      this.path = file;
      this.name = file.substring(file.lastIndexOf('/') + 1);
    } else {
      this.type = APIFileType.File;

      this.path = file.path;
      this.name = file.name;
    }
  }

  /**
   * Reads the content of this file as a readable stream
   * @returns {Promise<Stream>}
   */
  public async read(): Promise<NodeJS.ReadableStream> {
    if (this.type === APIFileType.File) {
      return fs.createReadStream(this.path);
    } else {
      const { body } = await fetch(this.path);
      return body;
    }
  }
}
