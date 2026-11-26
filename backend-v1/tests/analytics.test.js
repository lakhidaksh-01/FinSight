import request from "supertest";
import app from "../app.js";

describe("Analytics API", () => {
  let token;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `analytics${Date.now()}@example.com`,
        password: "Test@123456"
      });

    token = response.body.data.token;

    await request(app)
      .post("/api/income")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 50000,
        category: "Salary",
        date: new Date().toISOString()
      });

    await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 15000,
        category: "Food",
        date: new Date().toISOString()
      });
  });

  test("should return dashboard analytics", async () => {
    const response = await request(app)
      .get("/api/analytics/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(
      response.body.data
    ).toHaveProperty("totalIncome");

    expect(
      response.body.data
    ).toHaveProperty("totalExpenses");

    expect(
      response.body.data
    ).toHaveProperty("savings");

    expect(
      response.body.data
    ).toHaveProperty("savingsRate");
    expect(response.body.data).toMatchObject({
      totalIncome: 50000,
      totalExpenses: 15000,
      savings: 35000
    });

    const now = new Date();
    const dateOnly = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const dateRange = await request(app)
      .get(`/api/analytics/dashboard?startDate=${dateOnly}&endDate=${dateOnly}`)
      .set("Authorization", `Bearer ${token}`);

    expect(dateRange.statusCode).toBe(200);
    expect(dateRange.body.data).toMatchObject({
      totalIncome: 50000,
      totalExpenses: 15000
    });
  });

  test("should return spending analytics", async () => {
    const response = await request(app)
      .get("/api/analytics/spending")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(
      response.body.data
    ).toHaveProperty("totalExpenses");

    expect(
      response.body.data
    ).toHaveProperty("categoryTotals");
  });

  test("should return savings analytics", async () => {
    const response = await request(app)
      .get("/api/analytics/savings")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(
      response.body.data
    ).toHaveProperty("income");

    expect(
      response.body.data
    ).toHaveProperty("expenses");

    expect(
      response.body.data
    ).toHaveProperty("savings");
  });
});