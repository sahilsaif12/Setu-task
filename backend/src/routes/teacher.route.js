import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addDetails, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from "../controllers/teacher.controller.js";

const router=Router()

router.route('/')
            .post(upload.single("photo"),addDetails)
            .get(getAllTeachers)

router.route('/:id')
            .get(getTeacherById)
            .patch(updateTeacher)
            .delete(deleteTeacher)

// router.route('/refreshToken').get(refreshToken)

export default router
