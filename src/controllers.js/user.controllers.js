const USER_MODEL = require("../models/user.model");
const { apiError } = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");

module.exports.registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;

  if (
    [userName, email, fullName, password].some((field) => field.trim() === "")
  ) {
    return new apiError(400, "All fields are required");
  }

  const existedUser = USER_MODEL.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User already existed");
  }

  const localAvatarPath = req.files?.avatar[0].path;
  const localCoverImage = req.files?.coverImage[0].path;

  if (!localAvatarPath) {
    return apiError(400, "Avatar file is require");
  }

  const avatar = await uploadOnCloudinary(localAvatarPath);
  const coverImage = await uploadOnCloudinary(localCoverImage);
  if (!avatar) {
    return apiError(400, "Error while uploading image in cloudinary");
  }

  const user = await USER_MODEL({
    userName,
    email,
    fullName,
    password,
    avatar,
    coverImage,
  });

  const createdUser = await USER_MODEL.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return apiError(400, "error while creating the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User created successfully"));
});
