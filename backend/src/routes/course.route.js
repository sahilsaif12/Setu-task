import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addCourse, getAllCourse } from "../controllers/course.controller.js";

const router=Router()

router.route('/').get(getAllCourse)
router.route('/:teacherId')
            .post(upload.single("photo"),addCourse)
            

router.route('/:id')
            .get()

// router.route('/refreshToken').get(refreshToken)

export default router
