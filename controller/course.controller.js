import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import { updateStudent } from "./student.controller.js";

export const addCourse = async (req, res) => {
  const { title } = req.body;

  try {
    const course = await Course.findOne({ title });
    if (course) {
      return res.status(400).json({
        message: "Course already exists",
        sucess: false,
      });
    }
    const newCourse = new Course({ title });
    await newCourse.save();
    res.status(201).json({
      sucess: true,
      message: "Course added sucessfully",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Error adding Course",
      error: error.message,
    });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.find()
      .populate("students", "name email")
      .populate("teacher", "name");
    if (course.length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Cousre found" });
    }
    res.status(200).json({
      message: "Course gotten sucessfully",
      sucess: true,
      data: course,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error occured",
      error: error.message,
      sucess: false,
    });
  }
};

export const studentRegisterCourse = async (req, res) => {
  const { studentId } = req.params;
  const { courseId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Student found" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Course found" });
    }
    if (student.courses.includes(courseId)) {
      return res
        .status(400)
        .json({ sucess: false, message: "Student is already registered" });
    }
    student.courses.push(courseId);
    course.students.push(studentId);
    await student.save();
    await course.save();
    res.status(200).json({
      sucess: true,
      message: "Student registered sucessfully",
      data: { student, course },
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Error adding Course",
      error: error.message,
    });
  }
};

export const studentRegisterCourse2 = async (req, res) => {
  const { studentId } = req.params;
  const { courseId } = req.body;
  try {
    const student = await Student.findById(studentId);
    let course;
    if (!student) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Student found" });
    }
    for (let i = 0; i < courseId.length; i++) {
      if (student.courses.includes(courseId[i])) {
        return res
          .status(400)
          .json({ sucess: false, message: "Student is already registered for this course" });
      } else {
        student.courses.push(courseId[i]);
      }
    }
    for (let i = 0; i < courseId.length; i++) {
      const courseArr = [];
      course = await Course.findById(courseId[i]);
      if (!course) {
        return res
          .status(404)
          .json({ sucess: false, message: "No Course found" });
      } else {
        courseArr.push(course);
        courseArr.forEach((element) => {
          element.students.push(studentId);
        });
        await course.save();
      }
    }
    await student.save();
    res.status(200).json({
      sucess: true,
      message: "Student registered sucessfully",
      data: { student },
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An error occured",
      error: error.message,
    });
  }
};
export const getCourseById = async(req,res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id).populate("students", "name").populate("teacher", "name")
    if(!course){
      return res.status(404).json({
        msg: "Course not found",
        sucess: false
      })
    }
    res.status(200).json({
      sucess: true,
      msg: "Course gotten Sucessfully",
      data: course
    })
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "An error occured",
      error: error.message,
    });
  }
}
// export const deleteCourse = async (req, res) => {
//   const student = await Course.findByIdAndDelete(req.params.studentID);
//   if (!student) {
//     return res
//       .status(404)
//       .json({ sucess: false, message: "Course not found" });
//   }
//   res.status(200).json({
//     sucess: true,
//     message: "Course deleted Sucessfully",
//     data: student,
//   });
// };
