import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect routes — verifies JWT
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check cookie fallback
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_for_dev_mode_only");

    // Fetch user (exclude sensitive fields)
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    if (user.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

/**
 * Optional auth — attaches user if token present, but doesn't block
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.cookies?.accessToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_for_dev_mode_only");
      req.user = await User.findById(decoded.id).select("-password -refreshToken");
    }
  } catch (_) {
    // Ignore auth errors for optional routes
  }
  next();
};

/**
 * Role authorization — must come after `protect`
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};

/**
 * Admin-only shorthand
 */
export const adminOnly = authorize("admin", "superadmin");

/**
 * SuperAdmin-only shorthand
 */
export const superAdminOnly = authorize("superadmin");
