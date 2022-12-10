import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        return super.catch(exception, host);
    }
}