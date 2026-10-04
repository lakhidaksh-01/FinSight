import request from "supertest";
import app from "../app.js";

describe("Prediction API", () => {
  let token;
  let predictionId;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `prediction${Date.now()}@example.com`,
        password: "Test@123456"
      });

    token = response.body.data.token;
  });

  test("should create a prediction", async () => {
    const response = await request(app)
      .post("/api/predictions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        predictionType: "monthly_expense",
        predictedAmount: 25000,
        period: "2026-10",
        confidence: 85,
        model: "linear_regression"
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("_id");

    predictionId = response.body.data._id;
  });

  test("should get prediction history", async () => {
    const response = await request(app)
      .get("/api/predictions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("should get latest prediction", async () => {
    const response = await request(app)
      .get("/api/predictions/latest")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id).toBe(
      predictionId
    );
  });
});