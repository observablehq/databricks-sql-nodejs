"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Types_1 = require("./hive/Types");
const DBSQLOperation_1 = __importDefault(require("./DBSQLOperation"));
const StatusFactory_1 = __importDefault(require("./factory/StatusFactory"));
const InfoValue_1 = __importDefault(require("./dto/InfoValue"));
const utils_1 = require("./utils");
const IDBSQLLogger_1 = require("./contracts/IDBSQLLogger");
const defaultMaxRows = 100000;
function getDirectResultsOptions(maxRows = defaultMaxRows) {
    if (maxRows === null) {
        return {};
    }
    return {
        getDirectResults: {
            maxRows: new Types_1.Int64(maxRows),
        },
    };
}
class DBSQLSession {
    constructor(driver, sessionHandle, logger) {
        this.driver = driver;
        this.sessionHandle = sessionHandle;
        this.statusFactory = new StatusFactory_1.default();
        this.logger = logger;
        this.logger.log(IDBSQLLogger_1.LogLevel.debug, `Session created with id: ${this.getId()}`);
    }
    getId() {
        var _a, _b;
        return (0, uuid_1.stringify)(((_b = (_a = this.sessionHandle) === null || _a === void 0 ? void 0 : _a.sessionId) === null || _b === void 0 ? void 0 : _b.guid) || (0, uuid_1.parse)(uuid_1.NIL));
    }
    /**
     * Fetches info
     * @public
     * @param infoType - One of the values TCLIService_types.TGetInfoType
     * @returns Value corresponding to info type requested
     * @example
     * const response = await session.getInfo(thrift.TCLIService_types.TGetInfoType.CLI_DBMS_VER);
     */
    getInfo(infoType) {
        return this.driver
            .getInfo({
            sessionHandle: this.sessionHandle,
            infoType,
        })
            .then((response) => {
            this.assertStatus(response.status);
            return new InfoValue_1.default(response.infoValue);
        });
    }
    /**
     * Executes statement
     * @public
     * @param statement - SQL statement to be executed
     * @param options - maxRows field is used to specify Direct Results
     * @returns DBSQLOperation
     * @example
     * const operation = await session.executeStatement(query, { runAsync: true });
     */
    executeStatement(statement, options = {}) {
        return this.driver
            .executeStatement(Object.assign({ sessionHandle: this.sessionHandle, statement, queryTimeout: options.queryTimeout, runAsync: options.runAsync || false }, getDirectResultsOptions(options.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Information about supported data types
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getTypeInfo(request = {}) {
        return this.driver
            .getTypeInfo(Object.assign({ sessionHandle: this.sessionHandle, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Get list of catalogs
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getCatalogs(request = {}) {
        return this.driver
            .getCatalogs(Object.assign({ sessionHandle: this.sessionHandle, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Get list of schemas
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getSchemas(request = {}) {
        return this.driver
            .getSchemas(Object.assign({ sessionHandle: this.sessionHandle, catalogName: request.catalogName, schemaName: request.schemaName, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Get list of tables
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getTables(request = {}) {
        return this.driver
            .getTables(Object.assign({ sessionHandle: this.sessionHandle, catalogName: request.catalogName, schemaName: request.schemaName, tableName: request.tableName, tableTypes: request.tableTypes, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Get list of supported table types
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getTableTypes(request = {}) {
        return this.driver
            .getTableTypes(Object.assign({ sessionHandle: this.sessionHandle, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Get full information about columns of the table
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getColumns(request = {}) {
        return this.driver
            .getColumns(Object.assign({ sessionHandle: this.sessionHandle, catalogName: request.catalogName, schemaName: request.schemaName, tableName: request.tableName, columnName: request.columnName, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Get information about function
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getFunctions(request) {
        return this.driver
            .getFunctions(Object.assign({ sessionHandle: this.sessionHandle, catalogName: request.catalogName, schemaName: request.schemaName, functionName: request.functionName, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    getPrimaryKeys(request) {
        return this.driver
            .getPrimaryKeys(Object.assign({ sessionHandle: this.sessionHandle, catalogName: request.catalogName, schemaName: request.schemaName, tableName: request.tableName, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Request information about foreign keys between two tables
     * @public
     * @param request
     * @returns DBSQLOperation
     */
    getCrossReference(request) {
        return this.driver
            .getCrossReference(Object.assign({ sessionHandle: this.sessionHandle, parentCatalogName: request.parentCatalogName, parentSchemaName: request.parentSchemaName, parentTableName: request.parentTableName, foreignCatalogName: request.foreignCatalogName, foreignSchemaName: request.foreignSchemaName, foreignTableName: request.foreignTableName, runAsync: request.runAsync || false }, getDirectResultsOptions(request.maxRows)))
            .then((response) => this.createOperation(response));
    }
    /**
     * Closes the session
     * @public
     * @returns Operation status
     */
    close() {
        return this.driver
            .closeSession({
            sessionHandle: this.sessionHandle,
        })
            .then((response) => {
            this.logger.log(IDBSQLLogger_1.LogLevel.debug, `Session closed with id: ${this.getId()}`);
            return this.statusFactory.create(response.status);
        });
    }
    createOperation(response) {
        this.assertStatus(response.status);
        const handle = (0, utils_1.definedOrError)(response.operationHandle);
        return new DBSQLOperation_1.default(this.driver, handle, this.logger, response.directResults);
    }
    assertStatus(responseStatus) {
        this.statusFactory.create(responseStatus);
    }
}
exports.default = DBSQLSession;
//# sourceMappingURL=DBSQLSession.js.map