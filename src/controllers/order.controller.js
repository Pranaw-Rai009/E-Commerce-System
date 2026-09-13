import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";
import createOrderItem from "../controllers/cartItem.controller.js"

export const createNewOrder = asyncHandler(async (req, res) => {
    
    const cartItemsIds = req.body  //receiving the cartItems inthe form or array
    if (cartItemsIds.length === 0 || !cartItemsIds) throw new ApiError(400, "No items selected")

    const cart = await prisma.cart.findUnique({
        where: {
            userId: req.user.id
        }
    })

    const newOrderItems = await createNewOrder(cartItemsIds, cart.id, )
    const createOrder = await prisma.order.create({
        data: {
            userId: req.user.id,
            deliveryCharge
        }
    })

})