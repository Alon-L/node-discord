/// <reference types="node" />
/**
 * Websocket connection options
 */
export interface WebsocketOptions {
    /**
     * API Version
     */
    v: number;
    /**
     * Gateway payload encoding type
     */
    encoding: 'json' | 'etf';
    /**
     * Gateway payload compression type
     */
    compress?: 'zlib-stream';
    [key: string]: number | string | undefined;
}
/**
 * All details that are sent in the Bot's 'IDENTIFY' request
 */
export declare const identify: {
    properties: {
        $os: NodeJS.Platform;
        $browser: string;
        $device: string;
    };
    presence: {
        status: string;
    };
    large_threshold: number;
    version: number;
};
