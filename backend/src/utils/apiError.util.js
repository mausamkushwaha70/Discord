class ApiError extends Error{
    constructor(
        statusCode,
        message="invalid credentials",
        error = [],
        stack=""
    ){
        super(message)
        this.statusCode
        this.error=error
        if(stack){
            this.stack
        }else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default ApiError