import request from "supertest";
import app from "../app.js";

describe("Income API", () => {
  let token;
  let incomeId;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `income${Date.now()}@example.com`,
        password: "Test@123456"
      });

    token = response.body.data.token;
  });

  test("should create income", async () => {
    const response = await request(app)
      .post("/api/income")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 50000,
        category: "Salary",
        description: "Monthly salary",
        date: new Date().toISOString()
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    incomeId = response.body.data._id;
  });

  test("should get all income", async () => {
    const response = await request(app)
      .get("/api/income")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("should get one income", async () => {
    const response = await request(app)
      .get(`/api/income/${incomeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });

  test("should update income", async () => {
    const response = await request(app)
      .put(`/api/income/${incomeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 55000
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.data.amount).toBe(55000);
  });

  test("should delete income", async () => {
    const response = await request(app)
      .delete(`/api/income/${incomeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });
});