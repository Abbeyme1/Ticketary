import { CustomError } from "./customeError";


export class UnauthorizedError extends CustomError {

    statusCode = 401; // forbiddden

    constructor(){
        super('Unauthorized User');

        Object.setPrototypeOf(this,UnauthorizedError.prototype);
    }

    serializeErrors(){
        return [{message: 'Unauthorized User'}]
    }
}