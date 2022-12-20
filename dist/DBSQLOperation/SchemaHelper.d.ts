import { TOperationHandle, TGetResultSetMetadataResp } from '../../thrift/TCLIService_types';
import HiveDriver from '../hive/HiveDriver';
import IOperationResult from '../result/IOperationResult';
export default class SchemaHelper {
    private driver;
    private operationHandle;
    private statusFactory;
    private metadata?;
    constructor(driver: HiveDriver, operationHandle: TOperationHandle, metadata?: TGetResultSetMetadataResp);
    private fetchMetadata;
    fetch(): Promise<import("../../thrift/TCLIService_types").TTableSchema>;
    getResultHandler(): Promise<IOperationResult>;
}
