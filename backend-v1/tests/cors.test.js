import request from "supertest";
import app from "../app.js";

describe("CORS", () => {
  test("rejects untrusted origins with a forbidden response", async () => {
    const response = await request(app)
      .options("/api/auth/login")
      .set("Origin", "https://untrusted.example")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type");

    expect(response.statusCode).toBe(403);
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    expect(response.body).toEqual({
      success: false,
      message: "Origin not allowed by CORS",
    });
  });
});
