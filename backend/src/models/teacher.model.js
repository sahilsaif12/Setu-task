import mongoose, { Schema } from "mongoose"


const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    bio: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    linkedIn: {
        type: String,
        required: true
    },
    courses: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Course"
            }
        ],
    },
},
    { timestamps: true }
)

export const Teacher = mongoose.model("Teacher", teacherSchema)
