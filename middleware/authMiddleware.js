import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const authHead = req.headers.authorization;
    if (!authHead || !authHead.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ sucess: false, msg: "Not authorized, No Token" });
    }
    const token = authHead.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await Student.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      req.userType = user.role;
      return next();
    }
    user = await Teacher.findById(decoded.id).select("-password")
    if (user) {
      req.user = user;
      req.userType = user.role;
      return next();
    }
  } catch (error) {
    return res
      .status(401)
      .json({ sucess: false, msg: "Not authorized, Invalid Token" });
  }
};

export const authorize =  (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.userType)) {
      return res
        .status(403)
        .json({ sucess: false, msg: "Not allowed to access" });
    }
    return next();
  };
};
