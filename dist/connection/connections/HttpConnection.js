"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_1 = __importDefault(require("thrift"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const HttpTransport_1 = __importDefault(require("../transports/HttpTransport"));
class HttpConnection {
    constructor() {
        this.thrift = thrift_1.default;
    }
    connect(options, authProvider) {
        var _a, _b;
        const agentOptions = {
            keepAlive: true,
            maxSockets: 5,
            keepAliveMsecs: 10000,
        };
        const agent = ((_a = options.options) === null || _a === void 0 ? void 0 : _a.https)
            ? new https_1.default.Agent(Object.assign(Object.assign({}, agentOptions), { minVersion: 'TLSv1.2' }))
            : new http_1.default.Agent(agentOptions);
        const httpTransport = new HttpTransport_1.default(Object.assign(Object.assign({ transport: thrift_1.default.TBufferedTransport, protocol: thrift_1.default.TBinaryProtocol }, options.options), { nodeOptions: Object.assign(Object.assign({ agent }, this.getNodeOptions(options.options || {})), (((_b = options.options) === null || _b === void 0 ? void 0 : _b.nodeOptions) || {})) }));
        return authProvider.authenticate(httpTransport).then(() => {
            this.connection = this.thrift.createHttpConnection(options.host, options.port, httpTransport.getOptions());
            this.addCookieHandler();
            return this;
        });
    }
    getConnection() {
        return this.connection;
    }
    isConnected() {
        if (this.connection) {
            return true;
        }
        return false;
    }
    getNodeOptions(options) {
        const { ca, cert, key, https: useHttps } = options;
        const nodeOptions = {};
        if (ca) {
            nodeOptions.ca = ca;
        }
        if (cert) {
            nodeOptions.cert = cert;
        }
        if (key) {
            nodeOptions.key = key;
        }
        if (useHttps) {
            nodeOptions.rejectUnauthorized = false;
        }
        return nodeOptions;
    }
    addCookieHandler() {
        const { responseCallback } = this.connection;
        this.connection.responseCallback = (response) => {
            if (Array.isArray(response.headers['set-cookie'])) {
                const cookie = [this.connection.nodeOptions.headers.cookie];
                this.connection.nodeOptions.headers.cookie = cookie
                    .concat(response.headers['set-cookie'])
                    .filter(Boolean)
                    .join(';');
            }
            responseCallback.call(this.connection, response);
        };
    }
}
exports.default = HttpConnection;
//# sourceMappingURL=HttpConnection.js.map