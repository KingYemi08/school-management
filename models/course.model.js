import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  backCover: { type: String },
  teacher: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }]
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;


