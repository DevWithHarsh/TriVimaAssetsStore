import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import sendOTP from '../utils/sendOTP.js';

const sendForgotOTP = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) return res.json({ success: false, message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP = otp;
  user.resetOTPExpires = new Date(Date.now() + 15 * 60000); // 15 mins
  await user.save();

  try {
    await sendOTP(email, otp);
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    res.json({ success: false, message: 'Failed to send OTP' });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || user.resetOTP !== otp || user.resetOTPExpires < new Date()) {
    return res.json({ success: false, message: 'Invalid or expired OTP' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetOTP = null;
  user.resetOTPExpires = null;
  await user.save();

  res.json({ success: true, message: 'Password reset successful' });
};

export { sendForgotOTP, resetPassword };