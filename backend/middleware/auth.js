import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
