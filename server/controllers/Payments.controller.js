import instance from "../config/razorpay.config.js";
import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import mailSender from "../utils/mailSender.utils.js";
// import { CourseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
// import Razorpay from "razorpay";

// capture the payment and initiate the razorpay order
const capturePayment = async (req, res) => {
  try {
    // get the user and course id
    const userId = req.user.id;
    const { courseId } = req.body;
    // validation
    if (!courseId) {
      return res.status(400).json({ message: "Course id is required" });
    }
    // validate the courseDetails
    let course;
    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      // user already pay for the same course
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled.includes(uid)) {
        return res
          .status(400)
          .json({ message: "User already enrolled for this course" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }

    // create order
    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: course.id,
        userId: userId,
      },
    };

    try {
      // initiate payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
    // return response
    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount / 100,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// verify signature of razorpay and server
const verifySignature = async (req, res) => {
  try {
    const webhookSecret = "123456";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createhmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digestSignature = shasum.digest("hex");

    if (digestSignature === signature) {
      console.log("payment is Authorized");

      const { courseId, userId } = req.body.payload.payment.entity.notes;

      try {
        // fulfill the action
        //   find the course and enrolled the student
        const enrolledCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            $push: {
              studentEnrolled: userId,
            },
          },
          { new: true }
        );

        if (!enrolledCourse) {
          return res
            .status(404)
            .json({ success: false, message: "Course not found" });
        }

        console.log(enrolledCourse);

        //   find the student and add the course to their enrolled list
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
            },
          },
          { new: true }
        );

        if (!enrolledStudent) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
        console.log(enrolledStudent);

        // send email of confirmation
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "congratulation , you are onboarding"`Congratulations! You have successfully enrolled for the course: ${enrolledCourse.courseName}`
        );

        if (!emailResponse) {
          return res
            .status(404)
            .json({ success: false, message: "Failed to send email" });
        }
        console.log(emailResponse);

        return res.status(200).json({
          success: true,
          message: "signature verify and enrolled in course",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
      }
    } else {
      console.error("Invalid signature");
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

export { capturePayment, verifySignature, sendPaymentSuccessEmail };
