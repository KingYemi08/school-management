import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Attendance from "../models/attendance.model.js";
import { json } from "express";

export const markAttendance = async (req, res) => {
  const { value, teacherId } = req.body;
  const { StudentId } = req.params;
  if(!teacherId || value){
    return res.status(400).json({ message: "Please provide all fields", sucess: false });
  }
  try {
    const student = await Student.findById(StudentId);
    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Students found" });
    }
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Teachers found" });
    }
    const attendance = new Attendance({ value });
    attendance.students.push(StudentId);
    attendance.teacher.push(teacherId);
    await attendance.save();
    res.status(200).json({
      message: "Attendance Marked",
      sucess: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Error adding Course",
      error: error.message,
    });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("students", "name")
      .populate("teacher", "name");
    if (attendance.length === 0) {
      return res.status(404).json({ message: "No Attendance found" });
    }
    res.status(200).json({
      message: "Request Successful",
      sucess: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Error adding Course",
      error: error.message,
    });
  }
};
