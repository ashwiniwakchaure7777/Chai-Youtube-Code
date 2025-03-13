const USER_MODEL = require("../models/user.model");
const { apiError } = require("./apiError");

module.exports.generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return new apiError(
      501,
      "Error while creating the access and refreh tokens"
    );
  }
};
