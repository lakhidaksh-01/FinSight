import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

let mongoServer;

beforeAll(async () => {
  const testUri = process.env.TEST_MONGO_URI || process.env.MONGO_URI_TEST;

  if (testUri) {
    process.env.MONGO_URI = testUri;
  } else {
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoServer = await MongoMemoryServer.create();
      process.env.MONGO_URI = mongoServer.getUri();
    } catch (error) {
      throw new Error(
        "Database tests require TEST_MONGO_URI/MONGO_URI_TEST or the optional mongodb-memory-server package."
      );
    }
  }

  process.env.JWT_SECRET = process.env.JWT_SECRET || "phase4-test-secret";
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});