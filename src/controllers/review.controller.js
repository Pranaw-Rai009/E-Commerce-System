import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import { prisma } from "../db/dbConnect.js";

export const review = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const orderItemId = req.params.orderItemsId
    const { description } = req.body

    if (!orderItemId) throw new ApiError(400, "Missing the ordered item Id!")

    const isReceived = await prisma.orderItems.findFirst({
        where: { id: parseInt(orderItemId) },
        include: {
            order: {
                select: { id: true, userId: true, status: true }
            }
        }
    })
    if (!isReceived) throw new ApiError(404, "Order item not found!")

    if (isReceived.order.status !== "DELIVERED" || isReceived.order.userId !== userId) {
        throw new ApiError(403, "You can only review delivered orders you placed")
    }

    const createReview = await prisma.review.create({
        data: {
            description,
            productId: isReceived.productId,
            userId
        }
    })

    res.status(201).json({ message: "Review Added", review: createReview })
})

export const getReview = asyncHandler(async(req, res) => {
    const reviewId = req.params.reviewId
    if(!reviewId) throw new ApiError(400, "Review Id is missing!")
    
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId
        }
    })
    if(!review) throw new ApiError(404, "Review doesn't exist!")
    res.status(200).json(review)
})