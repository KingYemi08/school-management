import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  gender: { type: String, required: true },
  password: { type: String, required: true, minLength: 4 },
  role: { type: String, enum: ["admin", "teacher"], default: "teacher" },
  isLoggedIn: { type: Boolean, default: false },
  LastLogin: { type: Date, default: Date.now },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  avatar: {type: String},
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }
});

TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

TeacherSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;
