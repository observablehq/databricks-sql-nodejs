import { TOperationHandle, TGetOperationStatusResp } from '../../thrift/TCLIService_types';
import HiveDriver from '../hive/HiveDriver';
import { WaitUntilReadyOptions } from '../contracts/IOperation';
export default class OperationStatusHelper {
    private driver;
    private operationHandle;
    private statusFactory;
    private state;
    private operationStatus?;
    hasResultSet: boolean;
    constructor(driver: HiveDriver, operationHandle: TOperationHandle, operationStatus?: TGetOperationStatusResp);
    private isInProgress;
    private processOperationStatusResponse;
    status(progress: boolean): Promise<TGetOperationStatusResp>;
    private isReady;
    waitUntilReady(options?: WaitUntilReadyOptions): Promise<void>;
}
