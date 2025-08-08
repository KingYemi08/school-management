import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  grade: { type: String, trim: true, required: true },
  section: { type: String, enum:["nusery","primary", "secondary"], default: "nusery", required: true },
  students: [{type: mongoose.Schema.Types.ObjectId, ref: "Student"}],
  teacher: {type: mongoose.Schema.Types.ObjectId, ref: "Teacher"}
});

const Class = mongoose.model("Class", classSchema);
export default Class