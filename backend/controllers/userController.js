import userModel from "../models/userModel.js";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const getWishlist = async (req, res) => {
    const user = await userModel.findById(req.body.userId);
    res.json({ success: true, wishlist: user.wishlist || [] });
};

const addWishlist = async (req, res) => {
    const { userId, itemId } = req.body;
    const user = await userModel.findById(userId);
    if (!user.wishlist.includes(itemId)) {
        user.wishlist.push(itemId);
        await user.save();
    }
    res.json({ success: true, wishlist: user.wishlist });
};

const removeWishlist = async (req, res) => {
    const { userId, itemId } = req.body;
    const user = await userModel.findById(userId);
    user.wishlist = user.wishlist.filter(id => id !== itemId);
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
};

// Routes for user login
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}
// Routes for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validationg email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
        //hasing user password
        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hasedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
// Routes for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { email, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log('Admin login error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }

  // 🛠 Debug logs (optional for development)
  console.log("Saved OTP:", user.resetOTP);
  console.log("Entered OTP:", otp);
  console.log("Expires At:", user.resetOTPExpires);
  console.log("Current Time:", new Date());

  // ✅ Here's the condition you asked about:
  if (
    user.resetOTP !== otp ||                  // OTP mismatch
    user.resetOTPExpires < new Date()        // OTP expired
  ) {
    return res.json({ success: false, message: 'Invalid or expired OTP' });
  }

  // ✅ Proceed to update password
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetOTP = null;
  user.resetOTPExpires = null;
  await user.save();

  res.json({ success: true, message: 'Password reset successful' });
};


export { loginUser, registerUser, adminLogin, addWishlist,getWishlist,removeWishlist, resetPassword }