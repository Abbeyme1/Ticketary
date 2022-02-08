import {ValidationError} from'express-validator'
import { CustomError } from './customeError';

export class RequestValidationError extends CustomError {

    statusCode = 400
    constructor(public errors: ValidationError[]) {
        super('Invalid request params');
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
    }
}