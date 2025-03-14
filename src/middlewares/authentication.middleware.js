const jwt = require("jsonwebtoken");
// const { apiError } = require("../utils/apiError");
const USER_MODEL = require("../models/user.model");
require("dotenv")

module.exports.authentication = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "")
      
    //   console.log(token);
    console.log(process.env.ACCESS_TOKEN_SECRET);
      
    if (!token) {
      // apiError(401,"Token required") 
      return res.status(401).json({
        success: false,
        message: "Token required",
      });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("decoded",decoded);
    
    const isUser = await USER_MODEL.findById(decoded?._id).select("-password -refreshToken");
    
    if (!isUser) {
      // apiError(404,"User not found")
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    // new apiError(401,"You are not authorized")
    return res.status(401).json({
      success: false,
      error,
      message: "You are not authorized",
    });
  }
};
