import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const logOut = asyncHandler(async(req, res) => {
    await prisma.refreshToken.deleteMany({
        where: {
            userId: req.user.id
        }
    })
    res.clearCookie("refreshToken", {httpOnly: true, secure: true})
    res.status(200).json({message: "Logged out successfully"})
})