import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  value: { type: Number, trim: true },
  students: [{type: mongoose.Schema.Types.ObjectId, ref: "Student"}],
  teacher: [{type: mongoose.Schema.Types.ObjectId, ref: "Teacher"}]
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance