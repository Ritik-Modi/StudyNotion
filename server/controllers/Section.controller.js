import Section from "../models/Section.model.js";
import Course from "../models/Course.model.js";

const createSection = async (req, res) => {
  try {
    // Destructure courseId and sectionName from request body
    const { courseId, sectionName } = req.body;

    // Validate required fields
    if (!courseId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Missing properties!",
      });
    }

    // Create a new section
    const newSection = await Section.create({ sectionName });

    // Update the course by adding the new section ID to courseContent
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    // Return the updated course details
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourseDetails,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Server error while creating a section",
      error: error.message,
    });
  }
};

const updateSection = async (req, res) => {
  try {
    // destructure sectionName and section id from body
    const { sectionId, sectionName } = req.body;

    // data validation
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Missing properties!",
      });
    }
    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Server error while updating a section",
      error: error.message,
    });
  }
};

const deleteSection = async (req, res) => {
  try {
    // Destructure sectionId from params and courseId from body
    const { sectionId } = req.body;
    const { courseId } = req.body;

    // Validate inputs
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing sectionId parameter!",
      });
    }

    // Check if the section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found!",
      });
    }

    // Delete the section
    await Section.findByIdAndDelete(sectionId);

    // Update the course schema if courseId is provided
    let courseDetails = null;
    if (courseId) {
      courseDetails = await Course.findByIdAndUpdate(
        courseId,
        { $pull: { courseContent: sectionId } },
        { new: true }
      );
      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Course not found!",
        });
      }
    }

    // Return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      courseDetails,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Server error while deleting a section",
      error: error.message,
    });
  }
};

export { createSection, updateSection, deleteSection };
