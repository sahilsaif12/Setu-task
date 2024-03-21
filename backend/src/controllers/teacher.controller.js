
import fs from 'fs';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Teacher } from '../models/teacher.model.js';

const addDetails=async (req, res) =>{
    const {name,bio,role,linkedIn}=req.body;
    const photoLocalPath=req.file?.path

    if([name,bio,role,linkedIn].some((field)=>field?.trim()==="")){
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

    const teacher=await Teacher.create({
        name,
        bio,
        role,
        linkedIn,
        photo
    })

    if(!teacher){
        res.status(500).json(
            new ApiResponse(500,"something went wrong while adding the teacher")
        )
    }
    
    res.status(200).json(
        new ApiResponse(200,"teacher added successfully",teacher)
    )
}

const getAllTeachers = async(req, res) =>{
    const {role}=req.query
    let teachers 
    if (role) {
        teachers = await Teacher.find({role:role})
        
    }else{
        teachers = await Teacher.find()
    }
    if(!teachers){
        res.status(500).json(
            new ApiResponse(500,"something went wrong while fetching teacher")
        )
    }
    
    res.status(200).json(
        new ApiResponse(200,"all teacher fetched successfully",teachers)
    )
}

const getTeacherById=async(req, res)=>{
    const{id}=req.params
    const teacher=await Teacher.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(id)}
        },
        {
            $lookup:{
                from:"courses",
                foreignField:"_id",
                localField:"courses",
                as:"courses",
                pipeline:[
                    {
                        $project:{
                            title:1,
                            photo:1,
                            desc:1,
                            price:1
                        }
                    }
                ]
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(200," teacher details fetched successfully",teacher)
    )
}


const updateTeacher=async(req, res) =>{
    const { name,bio,role,linkedIn } = req.body
    const { id } = req.params
    console.log(name);
    if (name?.trim() == "") {
        res.status(400).json(
            new ApiResponse(400," name cannot be empty")
        )
        throw new ApiError(400, "")
    }

    let updateFields = {}

    if (name) updateFields.name = name
    if (bio) updateFields.bio = bio
    if (role) updateFields.role = role
    if (linkedIn) updateFields.linkedIn = linkedIn

    const localPhotoPath = req.file?.path
    if (localPhotoPath) {
        const response = await uploadOnCloudinary(localPhotoPath)
        if (!response) {
            fs.unlinkSync(localPhotoPath)
            res.status(400).json(
                new ApiResponse(400," photo file error in uploading in cloudinary")
            )
        }
        updateFields.photo = response.url
    }

    console.log(updateFields);
    const teacher = await Teacher.findByIdAndUpdate(
        id,
        {
            $set: updateFields
        },
        { new: true }
    )

    if (!teacher) {
        res.status(404).json(
            new ApiResponse(404," teacher not found ")
        )
    }

    res.status(200)
        .json(
            new ApiResponse(200, "teacher details updated successfully",teacher)
        )

}

const deleteTeacher=async (req, res) => {
    const { id } = req.params


    await Teacher.findByIdAndDelete(id)
    
    res.status(200)
        .json(
            new ApiResponse(200, "teacher profile deleted successfully")
        )
}
export{
    addDetails,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
}