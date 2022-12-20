import { TStatus } from '../../thrift/TCLIService_types';
import Status from '../dto/Status';
export default class StatusFactory {
    /**
     * @param status thrift status object from API responses
     * @throws {StatusError}
     */
    create(status: TStatus): Status;
    private isSuccess;
    private isError;
    private isExecuting;
}
