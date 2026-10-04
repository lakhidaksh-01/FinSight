import request from "supertest";
import app from "../app.js";

describe("Expense API", () => {
  let token;
  let expenseId;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `expense${Date.now()}@example.com`,
        password: "Test@123456"
      });

    token = response.body.data.token;
  });

  test("should create an expense", async () => {
    const response = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 500,
        category: "Food",
        description: "Lunch",
        date: new Date().toISOString()
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("_id");

    expenseId = response.body.data._id;
  });

  test("should get all expenses", async () => {
    const response = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("should get one expense", async () => {
    const response = await request(app)
      .get(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id).toBe(expenseId);
  });

  test("should update an expense", async () => {
    const response = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 750
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.amount).toBe(750);
  });

  test("should delete an expense", async () => {
    const response = await request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });
});