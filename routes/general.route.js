import express from "express"
import { login, logout } from "../controller/general.controller.js"
import { protect } from "../middleware/authMiddleware.js"
 
const router =  express.Router()

router.post("/login", login)
router.post("/logout", protect,  logout)

export default router