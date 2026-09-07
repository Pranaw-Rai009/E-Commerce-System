import { asyncHandler } from '../utils/asyncHandler.utils.js'
import ApiError from '../utils/apiError.utils.js'
import { prisma } from '../db/dbConnect.js'
import { hashPassword } from '../utils/passwordHash.utils.js'
import { json } from 'express'

export const userRegister = asyncHandler(async (req, res) => {
    const { fullName, userName, mobileNo, email, password, profilePic, role, shippingAddress } = req.body
    if (!fullName) throw new ApiError(400, "Full Name is required!")
    if (!userName) throw new ApiError(400, "User Name is required!")
    if (!mobileNo) throw new ApiError(400, "Mobile No. is required!")
    if (!email) throw new ApiError(400, "Email is required!")
    if (!password) throw new ApiError(400, "Password is required!")
    if (!role) throw new ApiError(400, "Role must be declared!")

    // User existence check
    const userExist = await prisma.User.findFirst({
        where: {
            OR: [{ userName} , {email }, {mobileNo}]
        }
    })
    if (userExist) {
        if (userExist.userName === userName) {  // checking if username is alredy taken
            throw new ApiError(409, "Username already taken!")
        } else if(userExist.email === email){  //checking if email is already exist
            throw new ApiError(409, "User with this email already exist!")
        } else {
            throw new ApiError(409, "User with this mobile number already exist!")
        }
    }

    // checking phone no validity
    if (mobileNo.length != 10) throw new ApiError(400, "Invalid moblie number")

        // checking password length validity
    if (password.length < 12) throw new ApiError(400, "Password must be at least 12 character long!")

        // hashing password
    const hashedPassword = await hashPassword(password)
    if(!hashedPassword) throw new ApiError(500, "Password hashing error!")
    
    if (role === "Customer") {
        if(!shippingAddress) throw new ApiError(400, "Shipping Address required!")
            const createUser = await prisma.User.create({
                data: {
                    fullName,
                    userName,
                    mobileNo,
                    email,
                    password: hashedPassword,
                    role,
                    shippingAddress
                }
            })
            res.status(201).json({message: "User Registered as customer"})
    } else if(role === "Seller") {
        const createUser = await prisma.User.create({
                data: {
                    fullName,
                    userName,
                    mobileNo,
                    email,
                    password: hashedPassword,
                    role
                }
            })
            res.status(201).json({message: "User Registered as seller", createUser})
    } else {
        throw new ApiError(400, "Role must be either Customer or Seller")
    }
})



// test purpose only
export const getAllSeller = asyncHandler(async(req, res) => {
    const userRole = req.params.role
    const allSeller = await prisma.User.findMany({
        where: {role: userRole}
    })
    res.status(200).json({message: "All Sellers: ", allSeller})
})

// test purpose only
export const getAllCustomer = asyncHandler(async(req, res) => {
    const userRole = req.params.role
    const allCustomer = await prisma.User.findMany({
        where: {role: userRole}
    })
    res.status(200).json({message: "All Customers: ", allCustomer})
})


