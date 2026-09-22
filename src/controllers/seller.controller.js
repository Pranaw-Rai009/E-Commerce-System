import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";

export const getMeAllMyOrders = asyncHandler(async(requ, res) => {
    const userId = req.user.userId
    const newOrders = await prisma.orderItems.findMany({
        where: {
            product: {
                sellerId: userId
            }
        },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                }
            },
            order: {
                select: {
                    id: true,
                    userId: true,
                    createdAt: true,
                    status: true
                }
            }
        }
    })
    if(!newOrders) throw new ApiError(500, "Error occured while fetching my new orders!")
    res.status(200).json({message: "My orders", orders: newOrders})

})