import express from "express"
import { getAttendance, markAttendance } from "../controller/attendance.controller.js"

const route = express.Router()

route.get('/', getAttendance)
route.post('/:StudentId', markAttendance)


export default route
