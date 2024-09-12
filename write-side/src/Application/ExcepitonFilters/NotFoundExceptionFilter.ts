import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import NotFoundBaseException from "src/Core/Exceptions/NotFoundBaseException";

@Catch(NotFoundBaseException)
export default class NotFoundBaseExceptionFilter implements ExceptionFilter<NotFoundBaseException>{
    catch(exception: NotFoundBaseException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = 404
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