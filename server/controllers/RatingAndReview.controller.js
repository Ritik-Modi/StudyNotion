import ratingAndReview from "../models/RatingAndReview.model.js";
import Course from "../models/Course.model.js";
import { Mongoose } from "mongoose";

// create rating
const createRating = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // fetch data from req body
    const { courseId, rating, review } = req.body;
    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res
        .status(400)
        .json({ success: false, message: "User not enrolled in the course" });
    }
    // check if user already reviewed the course
    const alreadyReviewed = await ratingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (!alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "User already reviewed the course" });
    }
    // create the rating and review
    const ratingReview = await ratingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //   update the course with rating/review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReview: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);

    //   return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error while creating rating" });
  }
};
// get Avg rating
const getAverageRating = async (req, res) => {
  try {
    // get the course id
    const courseId = req.body.courseId;

    // calculate average rating
    const result = await ratingAndReview.aggregate([
      { $match: { course: new Mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    //return the rating
    if (result.length > 0) {
      return res
        .status(200)
        .json({ success: true, averageRating: result[0].averageRating });
    }

    //    return response
    return res.status(200).json({
      success: false,
      message: "Avg rating is 0 , no rating is given till now",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// get All rating
const getAllRating = async (req, res) => {
  try {
    const allReview = await ratingAndReview
      .find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName LastName email , image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: allReview,
      message: "All Rating and Review fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get course all rating and review
const getCourseRatings = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate if courseId is provided
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseReviews = await ratingAndReview
      .find({ course: courseId }) // Filter reviews by course ID
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: courseReviews,
      message: "Course ratings and reviews fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createRating, getAverageRating, getAllRating, getCourseRatings };
