import { Router } from "express";
import { createOrLoginAdmin, refreshToken } from "../controllers/admin.controller.js";

const router=Router()

router.route('/').post(createOrLoginAdmin)
router.route('/refreshToken').get(refreshToken)

export default router

