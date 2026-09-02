export const error_middleware = (err, req,res,next)=>{
    const statusCode= err.statusCode || 500
    return res.status(statusCode).json({
        success:false,
        message:err.message,
        err:err.errors||[]
    })
}