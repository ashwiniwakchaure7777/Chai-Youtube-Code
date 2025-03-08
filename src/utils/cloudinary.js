const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dr1b5uygt",
  api_key: "546644753345222",
  api_secret: "<your_api_secret>",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is uploaded successfully", response.url);
    return response;
  } catch (error) {
    fs.unlink(localFilePath);
    return null;
  }
};

module.exports = uploadOnCloudinary;