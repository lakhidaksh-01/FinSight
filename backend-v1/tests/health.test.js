import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

describe("Health endpoint", () => {
  test("reports healthy only when the database is connected", async () => {
    expect(mongoose.connection.readyState).toBe(1);

    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      status: "healthy",
      database: "connected",
    });
  });

  test("reports unavailable when the database is disconnected", async () => {
    const connectedState = mongoose.connection.readyState;
    mongoose.connection.readyState = 0;

    try {
      const response = await request(app).get("/health");

      expect(response.statusCode).toBe(503);
      expect(response.body).toEqual({
        success: false,
        status: "unhealthy",
        database: "unavailable",
      });
    } finally {
      mongoose.connection.readyState = connectedState;
    }
  });
});
