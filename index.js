import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import studentRoute from "./routes/student.route.js"
import teacherRoute from "./routes/teacher.route.js"
import courseRoute from "./routes/course.route.js"
import attendanceRoute from "./routes/attendance.route.js"
import loginRoute from "./routes/general.route.js"
import classRoute from "./routes/class.route.js"
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173',"https://school-management-frontend-azure.vercel.app/","https://school-management-frontend-azure.vercel.app"], // Replace with your actual frontend URL if different
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add all methods your frontend uses
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any custom headers your frontend sends
}));

app.use("/api/v1/student", studentRoute)
app.use("/api/v1/teacher", teacherRoute)
app.use("/api/v1/course", courseRoute)
app.use("/api/v1/attendance", attendanceRoute)
app.use("/api/v1", loginRoute)
app.use("/api/v1/class", classRoute)



const PORT = process.env.PORT || 3000;
connectDB()
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
