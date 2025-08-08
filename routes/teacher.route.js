import express from "express"
import { addTeacher, getTeacherById, getTeachers, loginTeacher } from "../controller/teacher.controller.js"
import {  authorize, protect } from "../middleware/authMiddleware.js"
const router = express.Router()

router.post("/", protect, authorize("admin"), addTeacher)
router.post("/login", loginTeacher)
router.get("/", protect, authorize("admin"), getTeachers)
router.get("/:id", getTeacherById)

export default router