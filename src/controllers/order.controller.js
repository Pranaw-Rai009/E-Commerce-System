import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";

export const orderItem = asyncHandler(async(req, res) => {
    const cartItemsIds = req.body
    if(cartItemsIds.length === 0 || !cartItemsIds) throw new ApiError(400, "No items selected")
    
})