import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";
import jwt from 'jsonwebtoken'
import { generateAccessToken } from "../utils/token.utils.js";

export const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken
    if(!incomingRefreshToken) throw new ApiError(404, "Refresh token missing for verificatoin!")

    const verifyRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    if(!verifyRefreshToken) throw new ApiError(401, "Refresh Token Expired!")

    const userId = verifyRefreshToken.id
    const existUser = await prisma.User.findFirst({
        where: {id: userId}
    })
    if(!existUser) throw new ApiError(404, "User with this id doesn't exist [Verification of Refresh Access Token Step]")

    const accessToken = await generateAccessToken(existUser)
    if(!accessToken) throw new ApiError(500, "Access token generation failed! [Verification of Refresh Access Token Step]")
    res.status(200).json({AccessToken: accessToken})
})