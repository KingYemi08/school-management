// import Student from "../models/studentModel.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import jwt from "jsonwebtoken";

export const addStudent = async (req, res) => {
  const { name, age, email, password, classId } = req.body;
  try {
    const student = await Student.findOne({ email });
    const studClass = await Class.findById(classId);
    const avatar = req.files?.avatar?.[0].path || null;
    if(!studClass){
      return res.status(404).json({ msg: "Class not found", sucess: false })
    }
    if (student) {
      return res.status(400).json({
        message: "Student already exists",
        sucess: false,
      });
    }
    const newStudent = new Student({
      name,
      age,
      email,
      password,
      avatar: avatar,
      class: classId
    });
    studClass.students.push(newStudent._id)
    await newStudent.save();
    await studClass.save() 
    res.status(201).json({
      sucess: true,
      message: "Student added sucessfully",
      data: newStudent,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Error adding Student",
      error: error.message,
    });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.find({})
      .populate("courses", "title")
      .populate("class", "grade")
      .select("-password");
    if (student.length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No student found" });
    }
    res.status(200).json({
      message: "Students gotten sucessfully",
      sucess: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occured",
      error: error.message,
      sucess: false,
    });
  }
};

export const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id).populate("courses", "title").populate("class", "grade");
    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "Student not found" });
    }
    student
    res.status(200).json({ sucess: true, data: student });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An Error occured",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.studentID);
  if (!student) {
    return res
      .status(404)
      .json({ sucess: false, message: "Student not found" });
  }
  res.status(200).json({
    sucess: true,
    message: "Student deleted Sucessfully",
    data: student,
  });
};

export const updateStudent = async (req, res) => {
  const { studentID } = req.params;
  const { name, age } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      studentID,
      { name, age },
      { new: true }
    );
    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "Student not found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Student updated Sucessfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An Error occured",
      error: error.message,
    });
  }
};

export const studentLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student || !(await student.comparePassword(password))) {
      return res
        .status(401)
        .json({ sucess: false, message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    student.lastLogin = new Date();
    student.isLoggedIn = true;
    await student.save();
    res.status(200).json({
      msg: "Login sucessfull",
      sucess: true,
      data: student,
      token,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An Error occured",
      error: error.message,
    });
  }
};
