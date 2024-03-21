import mongoose from "mongoose";

const connectDb=async() => {
    try {
        const connectionIntance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`)
        console.log(`\nMONGODB connected || Db host: ${connectionIntance.connection.host}`);
    
    } catch (error) {
        console.log(`MONGODB connection error : ${error}`);
    }
}


export default connectDb