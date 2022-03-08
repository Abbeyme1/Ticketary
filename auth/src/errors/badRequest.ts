import { CustomError } from "./customeError";

export class BadRequest extends CustomError {

    statusCode = 400;
    public field = '';

    constructor(message: string,field?: string) {
        super(message);
        this.field = field ? field : ''
        Object.setPrototypeOf(this,BadRequest.prototype);
    }

    serializeErrors(){
        return [{
            message: this.message,
            field: this.field
        }]
    }

    
}