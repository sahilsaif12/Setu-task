import mongoose, { Schema } from "mongoose"


const courseSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    photo:{
        type:String,
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    teacher:{
        type:mongoose.Types.ObjectId,
        ref:"Teacher",
        required:true
    },
},
{timestamps:true}
)

export const Course=mongoose.model("Course",courseSchema)
