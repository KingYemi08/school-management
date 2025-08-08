import express from "express";
import { addCourse, getCourse, getCourseById, studentRegisterCourse, studentRegisterCourse2 } from "../controller/course.controller.js";
import {  authorize, protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", protect, authorize("admin"), addCourse);
router.get("/", protect, authorize("admin", "teacher"), getCourse);
router.get("/:id",protect, getCourseById)
router.post("/register/:studentId",protect, authorize("admin"), studentRegisterCourse)
router.post("/reg/:studentId", protect, authorize("admin", "teacher"), studentRegisterCourse2)

// router.get("/:id", getStudentById);
// router.delete("/delete/:studentID", deleteStudent);
// router.put("/:studentID", updateStudent);

export default router;
