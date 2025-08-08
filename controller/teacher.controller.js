import jwt from "jsonwebtoken";
import Course from "../models/course.model.js";
import Teacher from "../models/teacher.model.js";

export const addTeacher = async (req, res) => {
  const { name, email, gender, courseId, password } = req.body;
  const teacher = await Teacher.findOne({ email });
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  if (teacher) {
    return res.status(400).json({
      message: "Teacher already exists",
      sucess: false,
    });
  }
  const avatar = req.files?.avatar?.[0].path || null
  try {
    const newTeacher = new Teacher({ name, email, gender, password, avatar: avatar });
    newTeacher.courses.push(course);
    course.teacher.push(newTeacher);
    await newTeacher.save();
    await course.save();
    res.status(201).json({
      sucess: true,
      message: "Teacher added sucessfully",
      data: newTeacher,
    });
  } catch (error) {
    res.status(500).json({
      message: "An Error Occured",
      error: error.message,
    });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const student = await Teacher.find().populate("courses", "title").populate("class", "grade");
    if (student.length === 0) {
      return res.status(404).json({
        message: "No teachers found",
        sucess: false,
      });
    }
    res.status(200).json({
      message: "Request Successfull",
      sucess: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      message: "An Error Occured",
      error: error.message,
    });
  }
};
export const getTeacherById = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        sucess: false,
        msg: "No teacher found",
      });
    }
    res
      .status(200)
      .json({ sucess: true, msg: "Request sucessfull", data: teacher });
  } catch (error) {
    res.status(500).json({
      message: "An Error Occured",
      error: error.message,
    });
  }
};

export const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher || !(await teacher.comparePassword(password))) {
      return res
        .status(404)
        .json({ sucess: false, message: "Inavlid email or password" });
    }
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    teacher.isLoggedIn = true;
    teacher.LastLogin = new Date();
    await teacher.save();
    res.status(200).json({
      msg: "Login sucessfull",
      sucess: true,
      data: teacher,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "An Error Occured",
      error: error.message,
    });
  }
};
