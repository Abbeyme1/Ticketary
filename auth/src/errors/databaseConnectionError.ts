import { CustomError } from "./customeError";

export class DatabaseConnectionError extends CustomError {

    reason = 'Error connecting to database'
    statusCode = 500
    
    constructor() {
        super('error connecting to database');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors() {
        return [
            {
                message: this.reason
            }
        ]
    }
}