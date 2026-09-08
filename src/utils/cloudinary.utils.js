import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import ApiError from './apiError.utils'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary = async(localfilePath) => {
    try {
        if(!localfilePath) return null
        const response = await cloudinary.uploader.upload(localfilePath, {resource_type: "auto"})

        console.log("File is uploaded on cloudinary")
        fs.unlinkSync(localfilePath)
        return response
    } catch {
        fs.unlinkSync(localfilePath)
        return null
    }
}