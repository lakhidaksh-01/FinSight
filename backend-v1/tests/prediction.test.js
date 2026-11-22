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
    const now = new Date();

    for (let monthOffset = 0; monthOffset < 3; monthOffset += 1) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - monthOffset,
        10
      );

      await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 10000 + monthOffset * 500,
          category: "Food",
          description: "Forecast test expense",
          date: date.toISOString()
        });
    }

    const response = await request(app)
      .post("/api/predictions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        historyMonths: 6,
        horizon: 3
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data.forecasts)).toBe(true);
    expect(response.body.data.forecasts.length).toBe(3);
    expect(response.body.data.forecasts[0]).toHaveProperty("_id");

    predictionId = response.body.data.forecasts[0]._id;
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

    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.predictionType).toBe("expense_forecast");
  });
});