import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const isAcOwner = asyncHandler(async (req, res, next) => {
    const userId = req.user.id
    const acId = req.params.accountId
    if (!acId) throw new ApiError(400, "Account Id is missing [Verifying Account Onwer]")
    const isOwner = await prisma.user.findFirst({
        where: {
            id: parseInt(acId)
        }
    })

    if (!isOwner) throw new ApiError(401, "User not found!")
    // if(isOwner.id !== userId || isOwner.role !== "Admin") throw new ApiError(403, "Access Denied, [YOUR ARE NOT THE ACCOUNT OWNER or ADMIN]")
    const isAllowed = isOwner.id === userId || isOwner.role === "Admin"
    if (!isAllowed) throw new ApiError(401, "Access Denied [You are not Owner nor Admin]")
    // console.log(isOwner)
    req.owner = isOwner
    next()
})