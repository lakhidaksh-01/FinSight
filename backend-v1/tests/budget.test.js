import request from "supertest";
import app from "../app.js";

describe("Budget API", () => {
  let token;
  let budgetId;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `budget${Date.now()}@example.com`,
        password: "Test@123456"
      });

    token = response.body.data.token;
  });

  test("should create a budget", async () => {
    const response = await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category: "Food",
        amount: 10000,
        month: 9,
        year: 2026
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    budgetId = response.body.data._id;
  });

  test("should get all budgets", async () => {
    const response = await request(app)
      .get("/api/budgets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("should get one budget", async () => {
    const response = await request(app)
      .get(`/api/budgets/${budgetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });

  test("should update a budget", async () => {
    const response = await request(app)
      .put(`/api/budgets/${budgetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 12000
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.data.amount).toBe(12000);
  });

  test("should delete a budget", async () => {
    const response = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });
});