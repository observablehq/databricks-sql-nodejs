import { TOperationHandle, TCloseOperationResp } from '../../thrift/TCLIService_types';
import HiveDriver from '../hive/HiveDriver';
import Status from '../dto/Status';
export default class CompleteOperationHelper {
    private driver;
    private operationHandle;
    private statusFactory;
    closed: boolean;
    cancelled: boolean;
    constructor(driver: HiveDriver, operationHandle: TOperationHandle, closeOperation?: TCloseOperationResp);
    cancel(): Promise<Status>;
    close(): Promise<Status>;
}
