import request from "supertest";
import app from "../app.js";

describe("Goal API", () => {
  let token;
  let goalId;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `goal${Date.now()}@example.com`,
        password: "Test@123456"
      });

    token = response.body.data.token;
  });

  test("should create a goal", async () => {
    const response = await request(app)
      .post("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Emergency Fund",
        targetAmount: 100000,
        currentAmount: 20000,
        targetDate: "2027-12-31",
        description: "Build emergency savings"
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    goalId = response.body.data._id;
  });

  test("should get all goals", async () => {
    const response = await request(app)
      .get("/api/goals")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("should get one goal", async () => {
    const response = await request(app)
      .get(`/api/goals/${goalId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });

  test("should update a goal", async () => {
    const response = await request(app)
      .put(`/api/goals/${goalId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentAmount: 30000
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.data.currentAmount).toBe(
      30000
    );
  });

  test("should delete a goal", async () => {
    const response = await request(app)
      .delete(`/api/goals/${goalId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });
});