import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";
import createOrderItem from "../controllers/cartItem.controller.js"

export const createNewOrder = asyncHandler(async (req, res) => {

    const cartItemsIds = req.body  //receiving the cartItems inthe form or array
    if (cartItemsIds.length === 0 || !cartItemsIds) throw new ApiError(400, "No items selected")

    const userData = await prisma.user.findFirst({
        where: {
            id: req.user.id
        }
    })

    const orderDetailsPromises = cartItemsIds.map(async (itemId) => {
        return await prisma.cartItems.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId: req.user.id
                }
            },
            include: {
                product: {
                    select: {
                        price: true,
                        sellerId: true
                    }
                }
            }
        })
    })
    const orderDetail = await Promise.all(orderDetailsPromises)


    const itemBySeller={} // creating an empty object to store array of differnet sellers
    for(const items of orderDetail) {
        const sellerId = items.product.sellerId
        if(!itemBySeller[sellerId]) itemBySeller[sellerId] = [] //creating a unique key
        itemBySeller[sellerId].push[items]  // pusing items in key as value
    }

    let subTotal = 0
    let deliveryCharge = 0
    for(const sellerId in itemBySeller) {
        let sellerSubtotal = 0
        for(const item of itemBySeller[sellerId]) {
            sellerSubtotal += item.quantity * item.product.price
        }
        deliveryCharge += sellerSubtotal >= 50000 ? 0 : 130
        subTotal += sellerSubtotal
    }

    const totalAmount = subTotal + deliveryCharge

    const newOrder = await prisma.order.create({
        data: {
            userId: req.user.id,
            deliveryCharge,
            totalAmount,
            subTotal,
            shippingAddress: userData.shippingAddress,
            staus: "PENDING",
            paymentMethod: "CASH_ON_DELIVERY"
        }
    })

    if(!newOrder) throw new ApiError(500, "New order creation failed")

    await createOrderItem(cartItemsIds, req.user.id, newOrder.id).then(() =>{
        console.log(`Created Order Items for Order id: ${newOrder.id}`)
    })
    res.status(200).json(newOrder)



    // Wrong logic
    
    // const forEachItem = orderDetails.map(async (order1) => {
    //     const subTotalPrice = order1.quantity * order1.product.price
    //     return { subTotalPrice }
    // })

    // let subTotal = 0
    // let deliveryCharge = 0
    // for (const item of forEachOrder) {
    //     subTotal += item.subTotalPrice
    // }

    // let noOfSeller = []
    
    // const totalAmount = subtotal + deliveryCharge

    // const newOrder = await prisma.order.create({
    //     data: {
    //         userId: req.user.id,
    //         deliveryCharge,
    //         subTotal,
    //         totalAmount,
    //         shippingAddress: userData.shippingAddress,
    //     }
    // })
    // if(!newOrder) throw new ApiError(500, "Error occured while creating product!")
    // res.status(201).json(newOrder)
})