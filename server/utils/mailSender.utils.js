import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const mailSender = async (email, title, body) => {
  try {
    console.log("Using SMTP Host:", process.env.MAIN_HOST);
    console.log("Using SMTP Port:", process.env.MAIN_PORT);
    console.log("Using Email:", process.env.MAIN_USER);

    let transporter = nodemailer.createTransport({
      host: process.env.MAIN_HOST || "smtp.gmail.com",
      port: Number(process.env.MAIN_PORT) || 465,
      secure: process.env.MAIN_PORT == 465, // True for 465 (SSL), False for 587 (TLS)
      auth: {
        user: process.env.MAIN_USER,
        pass: process.env.MAIN_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allows self-signed certificates (optional)
      },
    });

    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIN_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default mailSender;
