import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:'20kb'}))
app.use(express.static("public"))

app.get('/',(req, res) => {

    res.json({msg:"hello SETU backend is working"})
})

import adminRouter from './src/routes/admin.route.js'
import teacherRouter from './src/routes/teacher.route.js'
import courseRouter from './src/routes/course.route.js'

app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/teachers", teacherRouter)
app.use("/api/v1/courses", courseRouter)



export default app