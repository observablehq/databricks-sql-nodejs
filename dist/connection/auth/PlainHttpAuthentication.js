"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlainHttpAuthentication {
    constructor(options) {
        this.username = (options === null || options === void 0 ? void 0 : options.username) || 'anonymous';
        this.password = (options === null || options === void 0 ? void 0 : options.password) !== undefined ? options === null || options === void 0 ? void 0 : options.password : 'anonymous';
        this.headers = (options === null || options === void 0 ? void 0 : options.headers) || {};
    }
    authenticate(transport) {
        transport.setOptions('headers', Object.assign(Object.assign({}, this.headers), { Authorization: this.getToken(this.username, this.password) }));
        return Promise.resolve(transport);
    }
    getToken(username, password) {
        return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
}
exports.default = PlainHttpAuthentication;
//# sourceMappingURL=PlainHttpAuthentication.js.map