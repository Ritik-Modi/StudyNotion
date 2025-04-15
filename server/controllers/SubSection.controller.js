import SubSection from "../models/SubSection.model.js ";
import Section from "../models/Section.model.js";

import uploadImageToCloudinary from "../utils/imageUploader.utils.js";
import deleteOldVideoFromCloudinary from "../utils/imageDeleter.utils.js";
import dotenv from "dotenv";
dotenv.config();

// create subsection handler function
const createSubSection = async (req, res) => {
  try {
    // Destructure the data from request body
    const { sectionId, title, timeDuration, description } = req.body;

    // Extract file/video
    const video = req.files?.videoFile;

    // Validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (sectionId, title, timeDuration, description, video) are required.",
      });
    }

    // Upload video to Cloudinary
    let uploadDetails;
    try {
      uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: "Error uploading video",
        error: uploadError.message,
      });
    }

    // Create the subsection
    const subsectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update section with the subsection ID
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subsectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection"); // Populate subSection field

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      message: "Subsection created successfully",
      data: {
        subsectionDetails,
        updatedSection,
      },
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Server error while creating subsection",
      error: error.message,
    });
  }
};

//  update subsection TODO: how we update the video
const updateSubSection = async (req, res) => {
  try {
    // Fetch data from the body
    const { subSectionId, title, timeDuration, description } = req.body;
    const video = req.files?.videoFile;
    console.log(subSectionId);

    // Validate data
    if (
      !subSectionId ||
      !title ||
      timeDuration === undefined ||
      description === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields [subSectionId, title, timeDuration, description] are required",
      });
    }

    let subsectionExist = await SubSection.findById(subSectionId);
    if (!subsectionExist) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    let videoUrl = subsectionExist.videoUrl;

    if (video) {
      if (!video.mimetype.startsWith("video/")) {
        return res.status(400).json({
          success: false,
          message: "Invalid video format",
        });
      }

      try {
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        );
        if (!uploadDetails || !uploadDetails.secure_url) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload video",
          });
        }
        videoUrl = uploadDetails.secure_url;

        // Optional: Delete the old video from storage if required
        await deleteOldVideoFromCloudinary(subsectionExist.videoUrl);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Error uploading video",
          error: uploadError.message,
        });
      }
    }

    // Update subsection
    subsectionExist.title = title;
    subsectionExist.timeDuration = timeDuration;
    subsectionExist.description = description;
    subsectionExist.videoUrl = videoUrl;

    await subsectionExist.save();

    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      data: subsectionExist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete Subsection
const deleteSubSection = async (req, res) => {
  try {
    // fetch the data subsection id and section id
    const { subSectionId, sectionId } = req.body;
    // validate the data
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Both subSectionId and sectionId are required",
      });
    }
    // delete the subsection
    await SubSection.findByIdAndDelete(subSectionId);
    // update the section schema for subsection id
    if (sectionId) {
      await Section.findByIdAndUpdate(
        sectionId,
        {
          $pull: {
            subSection: subSectionId,
          },
        },
        { new: true }
      );
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
    });
  } catch (error) {
    // handle server errors
    return res.status(500).json({
      success: false,
      message: "Server error while deleting subsection",
      error: error.message,
    });
  }
};

export { createSubSection, updateSubSection, deleteSubSection };
