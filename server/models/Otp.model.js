import mongoose from "mongoose";
import mailSender from "../utils/mailSender.utils.js";
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 300, // 5 min
  },
});

// a function to send the mail

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "verification email for study notion ",
      otpTemplate(otp)
    );
    console.log("email send successfully" + mailResponse);
  } catch (error) {
    console.log("error sending verification email" + error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

export default mongoose.model("Otp", otpSchema);
