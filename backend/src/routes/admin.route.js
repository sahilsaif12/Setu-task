import { Router } from "express";
import { createOrLoginAdmin, logout, refreshToken } from "../controllers/admin.controller.js";

const router=Router()

router.route('/').post(createOrLoginAdmin)
router.route('/refreshToken').get(refreshToken)
router.route('/logout').get(logout)
export default router

