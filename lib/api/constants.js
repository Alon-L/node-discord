"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.baseURL = exports.version = void 0;
/**
 * The latest version of the Discord API
 */
exports.version = 6;
/**
 * The base URL for the Discord API
 */
exports.baseURL = `https://discord.com/api/v${exports.version}`;
/**
 * All HTTP methods the API supports
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["Get"] = "GET";
    HttpMethod["Post"] = "POST";
    HttpMethod["Put"] = "PUT";
    HttpMethod["Patch"] = "PATCH";
    HttpMethod["Delete"] = "DELETE";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
