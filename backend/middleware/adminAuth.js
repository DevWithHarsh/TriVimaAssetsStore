import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin check (based on new token structure)
    if (
      decoded.role !== 'admin' ||
      decoded.email !== process.env.ADMIN_EMAIL
    ) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only. nigger youre not admin okay nigger wanna have some dickes???' });
    }

    req.admin = decoded; // optional, if you need it in controllers
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default adminAuth;
