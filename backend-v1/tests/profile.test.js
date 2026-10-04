import request from "supertest";
import app from "../app.js";

describe("Profile API", () => {
  let token;

  beforeAll(async () => {
    const email = `profile${Date.now()}@example.com`;
    const password = "Test@123456";

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password
      });

    token = response.body.data.token;
  });

  test("should get current user profile", async () => {
    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("email");
  });

  test("should update current user profile", async () => {
    const response = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "FinSight User",
        currency: "INR"
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name).toBe(
      "FinSight User"
    );
  });

  test("should reject profile request without token", async () => {
    const response = await request(app)
      .get("/api/profile");

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });
});