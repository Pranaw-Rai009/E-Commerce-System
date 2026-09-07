import { asyncHandler } from '../utils/asyncHandler.utils.js'
import ApiError from '../utils/apiError.utils.js'
import jwt from 'jsonwebtoken'


export const authAccess = asyncHandler(async (req, res, next) => {
    const incomingAccesToken = req.header["authorization"]
    const accessToken = incomingAccesToken.split(" ")[1]

    const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    if(!isVerified) throw new ApiError(401, "Invalid Access Token")
    
    req.user = isVerified
    next()
})