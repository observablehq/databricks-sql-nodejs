"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_1 = __importDefault(require("thrift"));
const events_1 = require("events");
const TCLIService_1 = __importDefault(require("../thrift/TCLIService"));
const TCLIService_types_1 = require("../thrift/TCLIService_types");
const HiveDriver_1 = __importDefault(require("./hive/HiveDriver"));
const Types_1 = require("./hive/Types");
const DBSQLSession_1 = __importDefault(require("./DBSQLSession"));
const NoSaslAuthentication_1 = __importDefault(require("./connection/auth/NoSaslAuthentication"));
const HttpConnection_1 = __importDefault(require("./connection/connections/HttpConnection"));
const StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
const HiveDriverError_1 = __importDefault(require("./errors/HiveDriverError"));
const utils_1 = require("./utils");
const PlainHttpAuthentication_1 = __importDefault(require("./connection/auth/PlainHttpAuthentication"));
const IDBSQLLogger_1 = require("./contracts/IDBSQLLogger");
const DBSQLLogger_1 = __importDefault(require("./DBSQLLogger"));
function prependSlash(str) {
    if (str.length > 0 && str.charAt(0) !== '/') {
        return `/${str}`;
    }
    return str;
}
function getInitialNamespaceOptions(catalogName, schemaName) {
    if (!catalogName && !schemaName) {
        return {};
    }
    return {
        initialNamespace: {
            catalogName,
            schemaName,
        },
    };
}
class DBSQLClient extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.thrift = thrift_1.default;
        this.connectionProvider = new HttpConnection_1.default();
        this.authProvider = new NoSaslAuthentication_1.default();
        this.statusFactory = new StatusFactory_1.default();
        this.logger = (options === null || options === void 0 ? void 0 : options.logger) || new DBSQLLogger_1.default();
        this.client = null;
        this.connection = null;
        this.logger.log(IDBSQLLogger_1.LogLevel.info, 'Created DBSQLClient');
    }
    getConnectionOptions(options) {
        const { host, port, path, token, clientId } = options, otherOptions = __rest(options, ["host", "port", "path", "token", "clientId"]);
        return {
            host,
            port: port || 443,
            options: Object.assign({ path: prependSlash(path), https: true }, otherOptions),
        };
    }
    /**
     * Connects DBSQLClient to endpoint
     * @public
     * @param options - host, path, and token are required
     * @returns Session object that can be used to execute statements
     * @example
     * const session = client.connect({host, path, token});
     */
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authProvider = new PlainHttpAuthentication_1.default({
                username: 'token',
                password: options.token,
                headers: {
                    'User-Agent': (0, utils_1.buildUserAgentString)(options.clientId),
                },
            });
            this.connection = yield this.connectionProvider.connect(this.getConnectionOptions(options), this.authProvider);
            this.client = this.thrift.createClient(TCLIService_1.default, this.connection.getConnection());
            this.connection.getConnection().on('error', (error) => {
                // Error.stack already contains error type and message, so log stack if available,
                // otherwise fall back to just error type + message
                this.logger.log(IDBSQLLogger_1.LogLevel.error, error.stack || `${error.name}: ${error.message}`);
                try {
                    this.emit('error', error);
                }
                catch (e) {
                    // EventEmitter will throw unhandled error when emitting 'error' event.
                    // Since we already logged it few lines above, just suppress this behaviour
                }
            });
            this.connection.getConnection().on('reconnecting', (params) => {
                this.logger.log(IDBSQLLogger_1.LogLevel.debug, `Reconnecting, params: ${JSON.stringify(params)}`);
                this.emit('reconnecting', params);
            });
            this.connection.getConnection().on('close', () => {
                this.logger.log(IDBSQLLogger_1.LogLevel.debug, 'Closing connection.');
                this.emit('close');
            });
            this.connection.getConnection().on('timeout', () => {
                this.logger.log(IDBSQLLogger_1.LogLevel.debug, 'Connection timed out.');
                this.emit('timeout');
            });
            return this;
        });
    }
    /**
     * Starts new session
     * @public
     * @param request - Can be instantiated with initialSchema, empty by default
     * @returns Session object that can be used to execute statements
     * @throws {StatusError}
     * @example
     * const session = await client.openSession();
     */
    openSession(request = {}) {
        var _a;
        if (!((_a = this.connection) === null || _a === void 0 ? void 0 : _a.isConnected())) {
            return Promise.reject(new HiveDriverError_1.default('DBSQLClient: connection is lost'));
        }
        const driver = new HiveDriver_1.default(this.getClient());
        return driver
            .openSession(Object.assign({ client_protocol_i64: new Types_1.Int64(TCLIService_types_1.TProtocolVersion.SPARK_CLI_SERVICE_PROTOCOL_V6) }, getInitialNamespaceOptions(request.initialCatalog, request.initialSchema)))
            .then((response) => {
            this.statusFactory.create(response.status);
            return new DBSQLSession_1.default(driver, (0, utils_1.definedOrError)(response.sessionHandle), this.logger);
        });
    }
    getClient() {
        if (!this.client) {
            throw new HiveDriverError_1.default('DBSQLClient: client is not initialized');
        }
        return this.client;
    }
    close() {
        if (!this.connection) {
            return Promise.resolve();
        }
        const thriftConnection = this.connection.getConnection();
        if (typeof thriftConnection.end === 'function') {
            this.connection.getConnection().end();
        }
        return Promise.resolve();
    }
}
exports.default = DBSQLClient;
//# sourceMappingURL=DBSQLClient.js.map