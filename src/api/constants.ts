/**
 * The latest version of the Discord API
 */
export const version = 6;

/**
 * The base URL for the Discord API
 */
export const baseURL = `https://discord.com/api/v${version}`;

/**
 * All HTTP methods the API supports
 */
export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}
