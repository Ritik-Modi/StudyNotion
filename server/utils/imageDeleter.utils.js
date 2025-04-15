import { v2 as cloudinary } from "cloudinary";

const deleteOldVideoFromCloudinary = async (videoUrl) => {
  try {
    // Extract the public ID from the URL
    const publicId = videoUrl.split("/").pop().split(".")[0]; // Extract public ID (e.g., "video_name" from ".../video_name.mp4")

    // Delete the video from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    console.log(`Old video deleted: ${publicId}`);
  } catch (error) {
    console.error("Error deleting old video from Cloudinary:", error.message);
    throw new Error("Failed to delete old video");
  }
};

export default deleteOldVideoFromCloudinary;
