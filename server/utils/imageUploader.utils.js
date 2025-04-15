import { v2 as cloudinary } from "cloudinary";

const uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    // ✅ Correcting the condition
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw error; // ✅ Throw the error so it can be caught in API response
  }
};

export default uploadImageToCloudinary;
