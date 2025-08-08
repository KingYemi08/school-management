import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email }).populate("courses", "title").populate("class", "grade teacher")
    const teacher = await Teacher.findOne({ email }).populate("class", "grade");
    if (!student && !teacher) {
      return res.status(404).json({
        sucess: false,
        msg: "No User Found",
      });
    }
    if (student && !(await student.comparePassword(password))) {
      return res.status(401).json({
        sucess: false,
        msg: "Invalid email or password",
      });
    }
    if (teacher && !(await teacher.comparePassword(password))) {
      return res.status(401).json({
        sucess: false,
        msg: "Invalid email or password",
      });
    }
    if (teacher) {
      const token = jwt.sign(
        { id: teacher._id, role: teacher.role },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );
      teacher.isLoggedIn = true;
      teacher.LastLogin = new Date();
      await teacher.save();
      return res.status(200).json({
        sucess: true,
        msg: "Login Sucessfull",
        data: teacher,
        token,
      });
    }
    if (student) {
      const token = jwt.sign(
        { id: student._id, role:student.role },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );
      student.isLoggedIn = true;
      student.lastLogin = new Date();
      await student.save();
      return res.status(200).json({
        sucess: true,
        msg: "Login Sucessfull",
        data: student,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An Error Occured",
      error: error.message,
    });
  }
};


export const logout = async (req, res) => {
  const { id } = req.body;
  try {
    const student = await Student.findById(id);
    const teacher = await Teacher.findById(id);
    if (!student && !teacher) {
      return res.status(404).json({
        sucess: false,
        msg: "No User Found",
      });
    }
    if (teacher) {
      teacher.isLoggedIn = false;
      await teacher.save();
      return res.status(200).json({
        sucess: true,
        msg: "Logout Sucessfull",
        data: teacher
      });
    }
    if (student) {
      student.isLoggedIn = false;
      await student.save();
      return res.status(200).json({
        sucess: true,
        msg: "Logout Sucessfull",
        data: student,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An Error Occured",
      error: error.message,
    });
  }
};
