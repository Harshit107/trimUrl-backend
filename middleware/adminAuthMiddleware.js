require("dotenv").config();
const crypto = require("crypto");
const CustomError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

/**
 * Super Admin / Ecosystem Service Authentication Middleware
 * Validates requests using ADMIN_API_KEY from headers or query parameters
 * and attaches the Super Admin user context to req.user.
 */
const adminAuthMiddleware = (req, res, next) => {
  const configuredKey = process.env.ADMIN_API_KEY;

  if (!configuredKey) {
    throw new CustomError(
      "ADMIN_API_KEY is not configured on server environment.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  // Check x-api-key header, Authorization header, or query param
  let providedKey = req.headers["x-api-key"] || req.query.api_key;

  if (!providedKey && req.headers.authorization) {
    const authHeader = req.headers.authorization.trim();
    if (authHeader.startsWith("Bearer ") || authHeader.startsWith("ApiKey ")) {
      providedKey = authHeader.split(" ")[1]?.trim();
    } else {
      providedKey = authHeader;
    }
  }

  if (!providedKey) {
    throw new CustomError(
      "Super Admin authentication required. Provide 'x-api-key' header or 'Authorization: Bearer <key>'.",
      StatusCodes.UNAUTHORIZED
    );
  }

  const providedBuffer = Buffer.from(providedKey);
  const configuredBuffer = Buffer.from(configuredKey);

  const isValid =
    providedBuffer.length === configuredBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, configuredBuffer);

  if (!isValid) {
    throw new CustomError(
      "Invalid Super Admin API Key provided.",
      StatusCodes.UNAUTHORIZED
    );
  }

  // Attach Super Admin user identity
  req.user = {
    id: process.env.ADMIN_USER_ID || "4a0dbecf-c646-44e7-92b9-559a6f878a8c",
    email: process.env.ADMIN_EMAIL || "harshit107.in@gmail.com",
    name: "Super Admin",
    role: "admin",
  };
  req.isAdmin = true;

  next();
};

module.exports = adminAuthMiddleware;
