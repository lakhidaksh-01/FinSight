import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["MONGO_URI", "JWT_SECRET"];

requiredVariables.forEach((name) => {
  if (!process.env[name]) {
    console.error(`${name} is required.`);
    process.exit(1);
  }
});

export default {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET
};