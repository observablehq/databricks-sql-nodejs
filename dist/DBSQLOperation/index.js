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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const OperationStatusHelper_1 = __importDefault(require("./OperationStatusHelper"));
const SchemaHelper_1 = __importDefault(require("./SchemaHelper"));
const FetchResultsHelper_1 = __importDefault(require("./FetchResultsHelper"));
const CompleteOperationHelper_1 = __importDefault(require("./CompleteOperationHelper"));
const IDBSQLLogger_1 = require("../contracts/IDBSQLLogger");
const defaultMaxRows = 100000;
class DBSQLOperation {
    constructor(driver, operationHandle, logger, directResults) {
        this.driver = driver;
        this.operationHandle = operationHandle;
        this.logger = logger;
        this._status = new OperationStatusHelper_1.default(this.driver, this.operationHandle, directResults === null || directResults === void 0 ? void 0 : directResults.operationStatus);
        this._schema = new SchemaHelper_1.default(this.driver, this.operationHandle, directResults === null || directResults === void 0 ? void 0 : directResults.resultSetMetadata);
        this._data = new FetchResultsHelper_1.default(this.driver, this.operationHandle, [directResults === null || directResults === void 0 ? void 0 : directResults.resultSet]);
        this._completeOperation = new CompleteOperationHelper_1.default(this.driver, this.operationHandle, directResults === null || directResults === void 0 ? void 0 : directResults.closeOperation);
        this.logger.log(IDBSQLLogger_1.LogLevel.debug, `Operation created with id: ${this.getId()}`);
    }
    getId() {
        var _a, _b;
        return (0, uuid_1.stringify)(((_b = (_a = this.operationHandle) === null || _a === void 0 ? void 0 : _a.operationId) === null || _b === void 0 ? void 0 : _b.guid) || (0, uuid_1.parse)(uuid_1.NIL));
    }
    /**
     * Fetches all data
     * @public
     * @param options - maxRows property can be set to limit chunk size
     * @returns Array of data with length equal to option.maxRows
     * @throws {StatusError}
     * @example
     * const result = await queryOperation.fetchAll();
     */
    fetchAll(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = [];
            do {
                // eslint-disable-next-line no-await-in-loop
                const chunk = yield this.fetchChunk(options);
                data.push(chunk);
            } while (yield this.hasMoreRows()); // eslint-disable-line no-await-in-loop
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(IDBSQLLogger_1.LogLevel.debug, `Fetched all data from operation with id: ${this.getId()}`);
            return data.flat();
        });
    }
    /**
     * Fetches chunk of data
     * @public
     * @param options - maxRows property sets chunk size
     * @returns Array of data with length equal to option.maxRows
     * @throws {StatusError}
     * @example
     * const result = await queryOperation.fetchChunk({maxRows: 1000});
     */
    fetchChunk(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._status.hasResultSet) {
                return [];
            }
            yield this._status.waitUntilReady(options);
            return Promise.all([this._schema.getResultHandler(), this._data.fetch((options === null || options === void 0 ? void 0 : options.maxRows) || defaultMaxRows)]).then(([resultHandler, data]) => {
                var _a;
                const result = resultHandler.getValue(data ? [data] : []);
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(IDBSQLLogger_1.LogLevel.debug, `Fetched chunk of size: ${(options === null || options === void 0 ? void 0 : options.maxRows) || defaultMaxRows} from operation with id: ${this.getId()}`);
                return Promise.resolve(result);
            });
        });
    }
    /**
     * Requests operation status
     * @param progress
     * @throws {StatusError}
     */
    status(progress = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(IDBSQLLogger_1.LogLevel.debug, `Fetching status for operation with id: ${this.getId()}`);
            return this._status.status(progress);
        });
    }
    /**
     * Cancels operation
     * @throws {StatusError}
     */
    cancel() {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(IDBSQLLogger_1.LogLevel.debug, `Operation with id: ${this.getId()} canceled.`);
        return this._completeOperation.cancel();
    }
    /**
     * Closes operation
     * @throws {StatusError}
     */
    close() {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(IDBSQLLogger_1.LogLevel.debug, `Closing operation with id: ${this.getId()}`);
        return this._completeOperation.close();
    }
    finished(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._status.waitUntilReady(options);
        });
    }
    hasMoreRows() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._completeOperation.closed || this._completeOperation.cancelled) {
                return false;
            }
            return this._data.hasMoreRows;
        });
    }
    getSchema(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._status.hasResultSet) {
                return null;
            }
            yield this._status.waitUntilReady(options);
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.log(IDBSQLLogger_1.LogLevel.debug, `Fetching schema for operation with id: ${this.getId()}`);
            return this._schema.fetch();
        });
    }
}
exports.default = DBSQLOperation;
//# sourceMappingURL=index.js.map