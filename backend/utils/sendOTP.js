import nodemailer from 'nodemailer';

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Reset Password OTP',
    text: `Your OTP to reset password is ${otp}`,
  });
};
export default sendOTP;
