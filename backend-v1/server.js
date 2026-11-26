import config from "./config/env.js";

const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`FinSight server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();