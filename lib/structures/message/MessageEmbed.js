"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEmbed = exports.MessageEmbedType = void 0;
const Timestamp_1 = require("../Timestamp");
/**
 * Embed types are "loosely defined" and, for the most part, are not used by our clients for rendering. Embed attributes power what is rendered. Embed types should be considered deprecated and might be removed in a future API version.
 */
var MessageEmbedType;
(function (MessageEmbedType) {
    MessageEmbedType["Rich"] = "rich";
    MessageEmbedType["Image"] = "image";
    MessageEmbedType["Video"] = "video";
    MessageEmbedType["Gifv"] = "gifv";
    MessageEmbedType["Article"] = "article";
    MessageEmbedType["Link"] = "link";
})(MessageEmbedType = exports.MessageEmbedType || (exports.MessageEmbedType = {}));
// TODO: Link this description to a guide page about Discord message embeds
/**
 * Represents an embed contained in a {@link Message}
 */
class MessageEmbed {
    constructor(embed) {
        this.init(embed);
    }
    /**
     * @ignore
     * @param {GatewayStruct} embed The embed data
     * @returns {this}
     */
    init(embed) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        this.structure = embed;
        this.title = embed.title;
        this.type = embed.type;
        this.description = embed.description;
        this.url = embed.url;
        this.timestamp = new Timestamp_1.Timestamp(embed.timestamp);
        this.color = embed.color;
        this.footer = {
            text: (_a = embed.footer) === null || _a === void 0 ? void 0 : _a.text,
            iconURL: (_b = embed.footer) === null || _b === void 0 ? void 0 : _b.icon_url,
            proxyIconURL: (_c = embed.footer) === null || _c === void 0 ? void 0 : _c.proxy_icon_url,
        };
        this.image = {
            url: (_d = embed.image) === null || _d === void 0 ? void 0 : _d.url,
            proxyURL: (_e = embed.image) === null || _e === void 0 ? void 0 : _e.proxy_url,
            dimensions: MessageEmbed.getDimensions(embed.image),
        };
        this.thumbnail = {
            url: (_f = embed.thumbnail) === null || _f === void 0 ? void 0 : _f.url,
            proxyURL: (_g = embed.thumbnail) === null || _g === void 0 ? void 0 : _g.proxy_url,
            dimensions: MessageEmbed.getDimensions(embed.thumbnail),
        };
        this.video = {
            url: (_h = embed.video) === null || _h === void 0 ? void 0 : _h.url,
            dimensions: MessageEmbed.getDimensions(embed.video),
        };
        this.provider = {
            name: (_j = embed.video) === null || _j === void 0 ? void 0 : _j.name,
            url: (_k = embed.video) === null || _k === void 0 ? void 0 : _k.url,
        };
        this.author = {
            name: (_l = embed.author) === null || _l === void 0 ? void 0 : _l.name,
            url: (_m = embed.author) === null || _m === void 0 ? void 0 : _m.url,
            iconURL: (_o = embed.author) === null || _o === void 0 ? void 0 : _o.icon_url,
            proxyIconURL: (_p = embed.author) === null || _p === void 0 ? void 0 : _p.proxy_icon_url,
        };
        this.fields = (_q = embed.fields) === null || _q === void 0 ? void 0 : _q.map((field) => ({
            name: field.name,
            content: field.value,
            inline: field.inline,
        }));
        return this;
    }
    /**
     * Returns the gateway structure of a given embed data
     * @param {MessageEmbedOptions} embed The embed data
     * @returns {GatewayStruct}
     */
    static dataToStructure(embed) {
        return {
            title: embed.title,
            type: embed.type,
            description: embed.description,
            url: embed.url,
            timestamp: embed.timestamp &&
                (embed.timestamp instanceof Timestamp_1.Timestamp
                    ? embed.timestamp.date
                    : new Date(embed.timestamp).toISOString()),
            color: embed.color,
            footer: embed.footer && {
                text: embed.footer.text,
                icon_url: embed.footer.iconURL,
                proxy_icon_url: embed.footer.proxyIconURL,
            },
            image: embed.image && {
                url: embed.image.url,
                proxy_url: embed.image.proxyURL,
                height: embed.image.dimensions.height,
                width: embed.image.dimensions.width,
            },
            thumbnail: embed.thumbnail && {
                url: embed.thumbnail.url,
                proxy_url: embed.thumbnail.proxyURL,
                height: embed.thumbnail.dimensions.height,
                width: embed.thumbnail.dimensions.width,
            },
            video: embed.video && {
                url: embed.video.url,
                height: embed.video.dimensions.height,
                width: embed.video.dimensions.width,
            },
            provider: embed.provider && {
                name: embed.provider.name,
                url: embed.provider.url,
            },
            author: embed.author && {
                name: embed.author.name,
                url: embed.author.url,
                icon_url: embed.author.iconURL,
                proxy_icon_url: embed.author.proxyIconURL,
            },
            fields: embed.fields &&
                embed.fields.map((field) => ({
                    name: field.name,
                    value: field.content,
                    inline: field.inline,
                })),
        };
    }
    /**
     * Returns the dimensions from a gateway structure
     * @param {{height: number, width: number}} struct The gateway structure including the dimensions information
     * @returns {Partial<Dimensions>}
     */
    static getDimensions(struct) {
        return {
            height: struct === null || struct === void 0 ? void 0 : struct.height,
            width: struct === null || struct === void 0 ? void 0 : struct.width,
        };
    }
    /**
     * Creates a new MessageEmbed object from the given message embed options
     * @param {MessageEmbedOptions} options The message embed
     * @returns {MessageEmbed}
     */
    static from(options) {
        return new MessageEmbed(MessageEmbed.dataToStructure(options));
    }
}
exports.MessageEmbed = MessageEmbed;
