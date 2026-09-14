export const asyncHandler = (requestHndler)=>{
    return (req, res, next)=>{
        Promise.resolve(requestHndler(req, res,next))
        .catch(next)
    }
}

export default asyncHandler