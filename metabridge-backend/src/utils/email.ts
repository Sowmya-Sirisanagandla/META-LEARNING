import nodemailer from "nodemailer";

export const sendEmailOTP = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Metabridge" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Login OTP",
    text: `Your OTP is: ${otp}`,
    html: `<h2>Your OTP: ${otp}</h2>`
  });
};
