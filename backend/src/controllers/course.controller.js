import { Course } from "../models/course.model.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCourse=async(req,res) => {
    const {teacherId} = req.params
    const {title,desc,price}=req.body;
    const photoLocalPath=req.file?.path

    if([title,desc,price].some((field)=>field?.trim()==="")){
        if (photoLocalPath) fs.unlinkSync(photoLocalPath)
        res.status(400)
        .json(
            new ApiResponse(400,"Few required fields are empty ! ")
        )
    }
    
    
    let photo=""
    const photoResponse=await uploadOnCloudinary(photoLocalPath)
    if (photoResponse) {
        photo=photoResponse.url
    }

    const course=await Course.create({
        title,
        desc,
        price,
        photo,
        teacher:teacherId
    })

    if(!course){
        res.status(500).json(
            new ApiResponse(500,"something went wrong while adding the course")
        )
    }
    
    await Teacher.findByIdAndUpdate(
        teacherId,
        {
            $push:{
                courses:{
                    $each:[course._id]
                }
            }
        }
    )
    res.status(200).json(
        new ApiResponse(200,"course added successfully",course)
    )
    
}

const getAllCourse=async (req, res) => {
    const courses=await Course.aggregate([
        {
            $lookup:{
                from:"teachers",
                foreignField:"_id",
                localField:"teacher",
                as:"teacher",
                pipeline:[
                    {
                        $project:{
                            name:1,
                            photo:1,
                            linkedIn:1,
                            role:1
                        }
                    }
                ]
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(200,"All courses fetched successfully",courses)
    )

}

export{
    addCourse,
    getAllCourse

}