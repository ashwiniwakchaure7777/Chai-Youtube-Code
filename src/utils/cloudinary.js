// utils/cloudinary.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Use promise-based fs
const ApiError = require("../utils/ApiError"); // Import ApiError for consistency

cloudinary.config({
  cloud_name: "dr1b5uygt",
  api_key: "546644753345222",
  api_secret: "<your_api_secret>",
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    throw new ApiError(400, "File path is required");
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded successfully:", response.url);

    // Clean up local file after successful upload
    await fs.unlink(localFilePath);
    console.log("Local file deleted:", localFilePath);

    return response;
  } catch (error) {
    // Clean up file if upload fails (if it still exists)
    try {
      await fs.unlink(localFilePath);
      console.log("Local file deleted after upload failure:", localFilePath);
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError.message);
    }
    throw new ApiError(500, "Failed to upload file to Cloudinary", [error.message]);
  }
};

module.exports = { uploadOnCloudinary };