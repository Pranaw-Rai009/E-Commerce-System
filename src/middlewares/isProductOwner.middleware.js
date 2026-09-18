import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const isProductOwner = asyncHandler(async (req, res, next) => {
    const prodId = req.params.productId
    if (!prodId) throw new ApiError(400, "Product Id is missing!")
    const userId = req.user.id

    const isOwner = await prisma.product.findFirst({
        where: {
            id: parseInt(prodId),
            sellerId: userId
        }
    })
    if (!isOwner) throw new ApiError(401, "Access Denied [You are not the owner]")
    req.isOwner = isOwner
    next()
})