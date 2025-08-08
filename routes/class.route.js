import express from "express"
import { addClass, getClass, getStudentByClass, registerTeacherForClass } from "../controller/class.controller.js"
import { authorize, protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get('/', protect, getClass)
router.get('/student/:id', protect, authorize("admin", "teacher"), getStudentByClass)
router.post('/',protect, authorize("admin"), addClass)
router.post('/regTeacher/:classId', protect, authorize("admin"), registerTeacherForClass)

export default router