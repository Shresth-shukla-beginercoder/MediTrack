import { verifyToken } from "../utils/jwt.js";

export const adminMiddleware = (req, res, next) => {
  // Step 1: Read the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in."
    });
  }

  // Step 2: Extract the JWT
  const token = authHeader.split(" ")[1];

  try {
    // Step 3: Verify the token
    const decoded = verifyToken(token);

    // Step 4: Check whether the account is an admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    // Step 5: Attach the authenticated identity to the request
    req.user = decoded;

    // Step 6: Allow the request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again."
    });
  }
};