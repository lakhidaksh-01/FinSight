export const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  let statusCode = error.statusCode || 500;
  let message =
    error.message || "Internal server error";

  // Mongoose validation error
  if (error.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Invalid MongoDB ObjectId
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // Duplicate MongoDB value
  if (error.code === 11000) {
    statusCode = 400;

    const field = Object.keys(
      error.keyPattern || {}
    )[0];

    message = `${field || "Field"} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};