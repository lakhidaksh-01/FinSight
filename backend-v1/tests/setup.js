import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});