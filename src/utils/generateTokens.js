const USER_MODEL = require("../models/user.model");
const { apiError } = require("./ApiError");

module.exports.generateAccessAndRefreshToken = async (user,res) => {
  try {
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    // return new apiError(
    //   501,
    //   "Error while creating the access and refreh tokens"
    // );

    return res.status(501).json({
      success: false,
      message: "Error while creating the access and refreh tokens",
    });
  }
};
