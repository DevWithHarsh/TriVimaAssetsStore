import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendOTP = async () => {
    const res = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
    if (res.data.success) {
      toast.success(res.data.message);
      setStep(2);
    } else {
      toast.error(res.data.message);
    }
  };

  const handleResetPassword = async () => {
    const res = await axios.post(`${backendUrl}/api/user/reset-password`, { email, otp, newPassword });
    if (res.data.success) {
      toast.success(res.data.message);
      setStep(1);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm m-auto mt-20">
      {step === 1 ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border p-2 w-full mb-4"
          />
          <button onClick={handleSendOTP} className="bg-black text-white px-4 py-2">
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border p-2 w-full mb-4"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="border p-2 w-full mb-4"
          />
          <button onClick={handleResetPassword} className="bg-black text-white px-4 py-2">
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;