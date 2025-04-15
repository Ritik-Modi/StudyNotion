import Profile from "../models/Profile.model.js";
import User from "../models/User.model.js";
import uploadImageToCloudinary from "../utils/imageUploader.utils.js";
import CourseProgress from "../models/CourseProgress.model.js";
import Course from "../models/Course.model.js";
import mongoose from "mongoose";
import convertSecondsToDuration from "../utils/secToDuration.utils.js";

const updateProfile = async (req, res) => {
  try {
    // Extract data from request body
    const {
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
      firstName = "",
      lastName = "",
    } = req.body;

    // Get user ID from authentication middleware
    const id = req.user?.id;
    console.log("User ID:", id, "Gender:", gender, "Contact:", contactNumber);

    if (!id || !contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Find user and profile
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found!",
      });
    }

    // Update Profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    await profileDetails.save(); // ✅ Await the save operation

    // Update User details
    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    await userDetails.save(); // ✅ Await user update

    // Return response with updated data
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        profile: profileDetails,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while updating profile",
    });
  }
};

// TODO: EXPLORE: schedule the deletion of the profile and user after 1 week using  cronJob
const deleteProfile = async (req, res) => {
  try {
    // get the user id
    const id = req.user?.id;
    // validate
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }
    // find the profile
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      }); // user not found
    }
    const profileId = userDetails.additionalDetails;

    // delete the profile and user
    await Profile.findByIdAndDelete(profileId);

    // TODO: unenroll user from the all enrolled courses

    await User.findByIdAndDelete(id);

    // return res
    return res.status(200).json({
      success: true,
      message: "Profile and User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error while deleting the User and Profile",
    });
  }
};
const getAllUserDetails = async (req, res) => {
  try {
    const id = req.user?.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // Debugging logs
    console.log("User Details:", userDetails);
    console.log("Additional Details:", userDetails?.additionalDetails);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    console.log("Uploaded files:", req.files); // Debugging

    if (!req.files || !req.files.displayPicture) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found" });
    }

    // Upload to Cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      "profile_pictures",
      1000,
      1000
    );

    if (!image || !image.secure_url) {
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }

    // Update user profile
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      success: false,
      message: "Error while updating profile picture",
    });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject();

    // Properly await all async tasks
    await Promise.all(
      userDetails.courses.map(async (course) => {
        let totalDurationInSeconds = 0;
        let totalSubsections = 0;

        course.courseContent.forEach((content) => {
          const sectionDuration = content.subSection.reduce(
            (acc, curr) => acc + parseInt(curr.timeDuration, 10),
            0
          );

          totalDurationInSeconds += sectionDuration;
          totalSubsections += content.subSection.length;
        });

        course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        const courseProgress = await CourseProgress.findOne({
          courseID: course._id,
          userId: userId,
        });

        const completedVideos = courseProgress?.completedVideos.length || 0;
        course.progressPercentage =
          totalSubsections === 0
            ? 100
            : Math.round((completedVideos / totalSubsections) * 10000) / 100;
      })
    );

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: { "Error in fetching enrolled courses": error.message },
    });
  }
};

const instructorDashBoard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  updateProfile,
  deleteProfile,
  getEnrolledCourses,
  instructorDashBoard,
  updateProfilePicture,
  getAllUserDetails,
};
