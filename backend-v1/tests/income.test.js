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

  test("should sort and summarize income across matching pages", async () => {
    const now = new Date().toISOString();
    for (const amount of [1000, 2000, 3000]) {
      await request(app)
        .post("/api/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount,
          category: "Summary test",
          description: "Paginated summary record",
          date: now
        });
    }

    const response = await request(app)
      .get("/api/income?search=summary&sort=highest&page=2&limit=1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].amount).toBe(2000);
    expect(response.body.data.pagination).toMatchObject({
      page: 2,
      limit: 1,
      total: 3,
      pages: 3
    });
    expect(response.body.data.summary).toMatchObject({
      total: 6000,
      count: 3,
      average: 2000,
      thisMonth: 6000,
      categories: [{ category: "Summary test", amount: 6000, count: 3 }]
    });
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