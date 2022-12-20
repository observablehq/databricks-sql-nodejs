/// <reference types="node" />
import { EventEmitter } from 'events';
import TCLIService from '../thrift/TCLIService';
import IDBSQLClient, { ConnectionOptions, OpenSessionRequest, ClientOptions } from './contracts/IDBSQLClient';
import IDBSQLSession from './contracts/IDBSQLSession';
export default class DBSQLClient extends EventEmitter implements IDBSQLClient {
    private client;
    private connection;
    private statusFactory;
    private connectionProvider;
    private authProvider;
    private logger;
    private thrift;
    constructor(options?: ClientOptions);
    private getConnectionOptions;
    /**
     * Connects DBSQLClient to endpoint
     * @public
     * @param options - host, path, and token are required
     * @returns Session object that can be used to execute statements
     * @example
     * const session = client.connect({host, path, token});
     */
    connect(options: ConnectionOptions): Promise<IDBSQLClient>;
    /**
     * Starts new session
     * @public
     * @param request - Can be instantiated with initialSchema, empty by default
     * @returns Session object that can be used to execute statements
     * @throws {StatusError}
     * @example
     * const session = await client.openSession();
     */
    openSession(request?: OpenSessionRequest): Promise<IDBSQLSession>;
    getClient(): TCLIService.Client;
    close(): Promise<void>;
}
