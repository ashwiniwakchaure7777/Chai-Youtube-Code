const USER_MODEL = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const apiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { generateAccessAndRefreshToken } = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");
const { uploadOnCloudinary } = require("../utils/cloudinary"); // Assuming this exists

module.exports.registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;

  if (
    [userName, email, fullName, password].some((field) => field.trim() === "")
  ) {
    // return new ApiError(400, "All fields are required");
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existedUser = await USER_MODEL.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    // throw new ApiError(409, "User already existed");
    return res.status(409).json({
      success: false,
      message: "User already existed",
    });
  }

  // const localAvatarPath = req.files?.avatar[0].path;
  // const localCoverImage = req.files?.coverImage[0].path;

  // if (!localAvatarPath) {
  //   throw ApiError(400, "Avatar file is require");
  // }

  // const avatar = await uploadOnCloudinary(localAvatarPath);
  // const coverImage = await uploadOnCloudinary(localCoverImage);
  // if (!avatar) {
  //   throw ApiError(400, "Error while uploading image in cloudinary");
  // }

  const user = await USER_MODEL.create({
    userName,
    email,
    fullName,
    password,
    // avatar,
    // coverImage,
  });

  const createdUser = await USER_MODEL.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    // throw new ApiError(400, "error while creating the user");
    return res.status(400).json({
      success: false,
      message: "error while creating the user",
    });
  }

  return res
    .status(201)
    .json({ success: true, createdUser, message: "User created successfully" });
});

module.exports.loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if ((!email || !userName) && !password) {
    // throw new ApiError(
    //   401,
    //   "Provide required fields username or email and password"
    // );

    return res.status(401).json({
      success: false,
      message: "Provide required fields username or email and password",
    });
  }

  const isUser = await USER_MODEL.findOne({ $or: [{ userName }, { email }] });
  if (!isUser) {
    // throw new ApiError(401, "Please register first");
    return res.status(401).json({
      success: false,
      message: "Please register first",
    });
  }
  console.log("");

  const verification = await isUser.verifyPassword(password);
  console.log("verification", verification);

  if (!verification) {
    // return new ApiError(401, "Please provide correct credentials");
    return res.status(401).json({
      success: false,
      message: "Please provide correct credentials",
    });
  }

  console.log("isUser", isUser);

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    isUser,
    res
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log("accessToken", accessToken);

  const user = await USER_MODEL.findById(isUser._id);
  return res
    .status(201)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json({
      success: true,
      user,
      accessToken,
      refreshToken,
      message: "User loggedIn successfully",
    });
});

module.exports.logout = asyncHandler(async (req, res) => {
  const { user } = req;

  await USER_MODEL.updateOne(
    { _id: user?._id },
    { refreshToken: "" },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json({ success: true, message: "Logged out succesfully" });
});

module.exports.refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies?.Refresh_token;
    if (!refreshToken) {
      // throw new ApiError(401, "refresh token required");
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const user = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    if (!user) {
      // throw new ApiError(404, "User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const refreshTokenDb = await user.refreshToken;

    if (!refreshToken !== !refreshTokenDb) {
      // throw new ApiError(401, "Provdie valid refresh token");
      return res.status(401).json({
        success: false,
        message: "Provdie valid refresh token",
      });
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookies("Access_token", accessToken, options)
      .cookies("Refresh_token", newRefreshToken, options)
      .json(
        new apiResponse(
          201,
          { accessToken, newRefreshToken },
          "Access token generated successfully"
        )
      );
  } catch (error) {
    // throw new ApiError(401, "Error while creating refresh access token");
    return res.status(401).json({
      success: false,
      message: "Error while logout",
    });
  }
});
