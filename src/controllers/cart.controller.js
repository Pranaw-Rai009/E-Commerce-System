import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const createMyCart = async(id) => {
    const userId = id
    return await prisma.Cart.create({
        data: {
            userId: id
        }
    })
}

export const openMyCart = asyncHandler(async(req, res) => {
    const userId = req.user.id
    const myCart = await prisma.Cart.findUnique({
        where: {
            userId: userId
        }
    })
    res.status(200).json({MyCart: myCart})
})