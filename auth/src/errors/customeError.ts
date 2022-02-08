
// it will allow us to carry this class to javascript world
// thts why we are not using interfaces becz they dont exists in that world

export abstract class CustomError extends Error{
    abstract statusCode: number
    abstract serializeErrors(): {
        message: string,
        field?: string
    }[]

    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }
    
}