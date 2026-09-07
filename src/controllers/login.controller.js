import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";
import { isModified } from "../utils/passwordHash.utils.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";
import ms from 'ms'

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email) throw new ApiError(400, "Email is required!")
    if (!password) throw new ApiError(400, "Password is required!")


    const existUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!existUser) throw new ApiError(404, "User with this email doesn't exist!")

    const hashedPassword = existUser.password
    const isCorrectPassword = await isModified(password, hashedPassword)
    if (!isCorrectPassword) throw new ApiError(401, "Password Incorrect!")

    const accessToken = generateAccessToken(existUser)
    const refreshToken = generateRefreshToken(existUser)
    if (!accessToken) throw new ApiError(500, "Access token generation failed")
    if (!refreshToken) throw new ApiError(500, "Refresh token generation failed")

    const expiryTime = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRY))
    if (!expiryTime) throw new ApiError(500, "Refresh token expiry time generation failed!")

    // userId don't accespt userExist.id so
    const id = existUser.id
    await prisma.refreshToken.create({
        data: {
            id,
            token: refreshToken,
            userId: id,
            expiresAt: expiryTime
        }
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
    })

    res.status(200).json({
        message: "Login Successfull",
        AccessToken: accessToken
    })
})