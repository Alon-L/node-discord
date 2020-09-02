/**
 * Represents an image being sent to the Discord API as Image Data
 * https://discord.com/developers/docs/reference#image-data
 */
export declare class ImageURI {
    /**
     * The path of the image
     */
    private readonly path;
    /**
     * @param {string} path The image path
     * @example ```typescript
     * const image = new ImageURI('./image.png');
     * ```
     */
    constructor(path: string);
    /**
     * Returns the image mime and base64 data as a formatted string
     * @returns {string}
     */
    stringify(): Promise<string>;
    /**
     * Returns the image as base64
     * @type {string}
     */
    private get image();
    /**
     * Returns the mime type of the image
     * @type {string | boolean}
     */
    private get mime();
}
