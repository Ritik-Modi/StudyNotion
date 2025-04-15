import Category from "../models/Category.model.js";
import Course from "../models/Course.model.js";

// create category handler function

const createCategory = async (req, res) => {
  try {
    // fetch data from request body
    const { name, description } = req.body;
    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all field are required!",
      });
    }

    //create entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);
    // return response
    res.status(200).json({
      success: true,
      message: "category created successfully",
      data: categoryDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating a category",
    });
  }
};

// get all tags handler function
const getAllCategories = async (req, res) => {
  try {
    // Fetch categories with selected fields (name and description)
    const allCategory = await Category.find({}).select("name description");

    if (allCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    // Return success response with category data
    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: allCategory,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching categories",
    });
  }
};

const categoryPageDetails = async (req, res) => {
  try {
    // get category id
    const { categoryId } = req.body;
    // get course for specific category
    const selectedCategory = await Category.findById(categoryId).populate(
      "course"
    );
    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // get course for different category
    const differentCategory = await Category.find({
      _id: { $ne: categoryId },
    }).populate("course");

    // get the top selling course

    const topSellingCourse = await Course.find({})
      .sort({
        studentEnrolled: -1,
      })
      .limit(10);

    // return response
    res.status(200).json({
      success: true,
      message: "Category details fetched successfully",
      data: selectedCategory,
      differentCategory,
      topSellingCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { createCategory, getAllCategories, categoryPageDetails };
