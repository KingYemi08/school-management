import express from "express";
import {
  addStudent,
  getStudent,
  getStudentById,
  deleteStudent,
  updateStudent,
  studentLogin,
} from "../controller/student.controller.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import uploadMiddleWare from "../utils/upload.js";

const router = express.Router();

router.post("/", protect, authorize("teacher", "admin"),uploadMiddleWare,  addStudent);
router.post("/login", studentLogin);
router.get("/", protect, authorize("admin"), getStudent);
router.get("/:id", protect, getStudentById);
router.delete("/:studentID", protect, authorize("admin"), deleteStudent);
router.put("/:studentID", protect, authorize("admin"), updateStudent);

export default router;
