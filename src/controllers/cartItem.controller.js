import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const createCartItem = async(productQuantity, productId, myCartId) => {
    return await prisma.cartItems.create({
        data: {
            productId,
            quantity: productQuantity,
            cartId: myCartId
        }
    })
}