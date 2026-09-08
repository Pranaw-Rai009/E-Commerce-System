import { asyncHandler } from '../utils/asyncHandler.utils.js'
import ApiError from '../utils/apiError.utils.js'
import jwt from 'jsonwebtoken'


export const authAccess = asyncHandler(async (req, res, next) => {
    const incomingAccessToken = req.headers["authorization"]
    if(!incomingAccessToken) throw new ApiError(400, "Authorization Header missing!")
    const accessToken = incomingAccessToken.split(" ")[1]

    const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    if(!isVerified) throw new ApiError(401, "Invalid Access Token")
    
    req.user = isVerified
    next()
})