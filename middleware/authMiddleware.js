require("dotenv").config();
const jwt = require("jsonwebtoken");
const CustomError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const { container } = require("../container");

const authHandlerMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new CustomError(
      "Authentication required. No valid Bearer token provided.",
      StatusCodes.UNAUTHORIZED
    );
  }

  const token = authorization.split(" ")[1]?.trim();

  if (!token) {
    throw new CustomError(
      "Authentication token missing.",
      StatusCodes.UNAUTHORIZED
    );
  }


  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "developmentSecretKey123!"
    );
    const { userId } = decoded;

<<<<<<< HEAD
    const user = await User.findById(userId);
    if (!user)
      throw new CustomError(
        "No user available with this email address. ",
        StatusCodes.UNAUTHORIZED
      );
    const myToken = user.tokens.filter((t) => t.token === token);
    if (myToken.length === 0)
      throw new CustomError(
        "you are not authorised to access this route",
        StatusCodes.UNAUTHORIZED
      );
=======
    const authService = container.getAuthService();
    const user = await authService.verifySession(userId, token);

>>>>>>> main
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    if (error.name === "TokenExpiredError") {
      throw new CustomError(
        "Token has expired. Please log in again.",
        StatusCodes.UNAUTHORIZED
      );
    }
    if (error.name === "JsonWebTokenError") {
      throw new CustomError(
        "Invalid authentication token.",
        StatusCodes.UNAUTHORIZED
      );
    }
    throw new CustomError(
      error.message || "Not authorized to access this resource",
      StatusCodes.UNAUTHORIZED
    );
  }
};

module.exports = authHandlerMiddleware;
