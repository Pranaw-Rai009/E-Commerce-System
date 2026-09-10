import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const createCartItem = async (productQuantity, productId, myCartId) => {
    // Checking if the item already exists in my cart
    const itemAlreadyExist = await prisma.cartItems.findFirst({
        where: {
            productId,
            cartId: myCartId
        }
    })
    if (itemAlreadyExist) {
        return await prisma.cartItems.update({
            where:{
                id: itemAlreadyExist.id
            },
            data: {
                productId,
                quantity: (productQuantity + itemAlreadyExist.quantity),
                cartId: myCartId
            }
        })
    } else {
        return await prisma.cartItems.create({
            data: {
                productId,
                quantity: productQuantity,
                cartId: myCartId
            }
        })

    }
}

