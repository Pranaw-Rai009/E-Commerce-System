import jwt from 'jsonwebtoken'

export const generateAccessToken = function(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            userName: user.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const generateRefreshToken = function(user) {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}