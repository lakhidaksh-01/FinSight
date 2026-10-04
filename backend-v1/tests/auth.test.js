import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
  const email = `test${Date.now()}@example.com`;
  const password = "Test@123456";

  test("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("user");
  });

  test("should login an existing user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("token");
  });

  test("should reject invalid login credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "WrongPassword123"
      });

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });
});