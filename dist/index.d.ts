import TCLIService from '../thrift/TCLIService';
import TCLIService_types from '../thrift/TCLIService_types';
import DBSQLClient from './DBSQLClient';
import DBSQLSession from './DBSQLSession';
import DBSQLLogger from './DBSQLLogger';
import NoSaslAuthentication from './connection/auth/NoSaslAuthentication';
import PlainHttpAuthentication from './connection/auth/PlainHttpAuthentication';
import HttpConnection from './connection/connections/HttpConnection';
import { formatProgress } from './utils';
import { LogLevel } from './contracts/IDBSQLLogger';
export declare const auth: {
    NoSaslAuthentication: typeof NoSaslAuthentication;
    PlainHttpAuthentication: typeof PlainHttpAuthentication;
};
export declare const connections: {
    HttpConnection: typeof HttpConnection;
};
export declare const thrift: {
    TCLIService: typeof TCLIService;
    TCLIService_types: typeof TCLIService_types;
};
export declare const utils: {
    formatProgress: typeof formatProgress;
};
export { DBSQLClient, DBSQLSession, DBSQLLogger, LogLevel };
