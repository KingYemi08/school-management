import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";

export const addClass = async (req, res) => {
  const { grade, section } = req.body;
  try {
    const studClass = await Class.findOne({ grade });
    if (studClass) {
      return res.status(400).json({
        sucess: false,
        msg: "Class already exists",
      });
    }
    const newClass = new Class({ grade, section });
    await newClass.save();
    res
      .status(201)
      .json({ msg: "Class created sucessfully", sucess: true, data: newClass });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Error adding Class",
      error: error.message,
    });
  }
};

export const getClass = async (req, res) => {
  try {
    const studClass = await Class.find()
      .populate("students", "name")
      .populate("teacher", "name");
    if (studClass.length === 0) {
      return res.status(200).json({ 
        msg: "No Class found",
        sucess: false,
      });
    }
    res
      .status(200)
      .json({ msg: "Classes found", sucess: true, data: studClass });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An error occured",
      error: error.message,
    });
  }
};

export const getStudentByClass = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.find({ class: id })
      .populate("courses", "title")
      .select("-password");
    if (student.length === 0) {
      return res
        .status(404)
        .json({ sucess: false, msg: "No student found in this class" });
    }
    res
      .status(200)
      .json({ sucess: true, msg: "Students Found ✅", data: student });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An error occured",
      error: error.message,
    });
  }
};

export const registerTeacherForClass = async (req, res) => {
  const { classId } = req.params;
  const { id } = req.body;
  try {
    const teachClass = await Class.findById(classId);
    const teacher = await Teacher.findById(id);
    if (!teachClass || !teacher) {
      return res
        .status(404)
        .json({ sucess: false, msg: "No class or teachers found" });
    }
    teacher.class = classId;
    teachClass.teacher = id;
    await teacher.save();
    await teachClass.save();
    res
      .status(200)
      .json({
        sucess: false,
        msg: "Request Sucessfull",
        data: { teachClass, teacher },
      });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An error occured",
      error: error.message,
    });
  }
};
