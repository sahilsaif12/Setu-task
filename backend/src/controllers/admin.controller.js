import { Admin } from "../models/admin.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'

const options = {
    httpOnly: false,
    secure: true
}


const createOrLoginAdmin = async (req, res) => {
    const { username, password } = req.body

    if ([username, password].some(field => field.trim() === "")) {
        res.status(400)
            .json(
                new ApiResponse(400, "all fields are required")
            )
    }

    let admin = await Admin.findOne({ username })

    if (admin) {
        const isPasswordValid =await admin.isPasswordCorrect(password)
        if (!isPasswordValid) {
            res.status(401)
                .json(
                    new ApiResponse(401, "incorrect password")
                )
        }
        
    } 
    else {
        admin = await Admin.create({
            username,
            password
        })

        if (!admin) {
            res.status(500)
                .json(
                    new ApiResponse(500, "server problem while creating admin")
                )
        }
    }
    
    const accessToken =await admin.generateAccessToken()
    res.status(200)
        .cookie("accessToken", accessToken,options)
        .json(
            new ApiResponse(200, "User logged in", { accessToken })
        )
}


const refreshToken=async(req,res)=>{
    const incomingToken=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    let userId = null
    
    await jwt.verify(incomingToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                throw new ApiError(400, "Given refresh token is expired")
            } else {
                throw new ApiError(401, "Unauthorized token", [err.message])
            }
        } else {
            userId = decoded?._id

        }
    })

    const user = await Admin.findById(userId)
    if (!user) {
        throw new ApiError(400, "invalid refresh token")
    }

    const accessToken = await user.generateAccessToken() 

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                "tokens are updated successfully",
                {accessToken}
                )
        )

}
export {
    createOrLoginAdmin,
    refreshToken
}