import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  email: { type: String, required: true, trim: true, unique: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  password: { type: String, required: true, minLength: 4 },
  isLoggedIn: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
  avatar: { type: String },
  role: { type: String, enum: ["student", "prefect"], default: "student" },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" , required: true}
  // attendance: [{type: mongoose.Schema.Types.ObjectId, ref: "Attendance"}],
});

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Student = mongoose.model("Student", studentSchema);
export default Student;
