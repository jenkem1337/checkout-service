import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import InvalidOperationException from "src/Core/Exceptions/InvalidOperationException";

@Catch(InvalidOperationException)
export default class InvalidOperationExceptionFilter implements ExceptionFilter<InvalidOperationException>{
    catch(exception: InvalidOperationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = 400
        response
          .status(status)
          .json({
            statusCode: status,
            error_message:exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
          });
    
    }
}