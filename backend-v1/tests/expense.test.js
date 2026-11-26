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

  test("should search, sort, paginate, and summarize the full matching expense set", async () => {
    const now = new Date().toISOString();
    for (const amount of [100, 200, 300]) {
      await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount,
          category: "Summary test",
          description: "Paginated summary record",
          date: now
        });
    }

    const response = await request(app)
      .get("/api/expenses?search=summary&sort=highest&page=1&limit=1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].amount).toBe(300);
    expect(response.body.data.pagination).toMatchObject({
      page: 1,
      limit: 1,
      total: 3,
      pages: 3
    });
    expect(response.body.data.summary).toMatchObject({
      total: 600,
      count: 3,
      average: 200,
      thisMonth: 600,
      categories: [{ category: "Summary test", amount: 600, count: 3 }]
    });
    expect(response.body.data.summary.largest.amount).toBe(300);

    const numericSearch = await request(app)
      .get("/api/expenses?search=200&page=1&limit=20")
      .set("Authorization", `Bearer ${token}`);

    expect(numericSearch.body.data.pagination.total).toBe(1);
    expect(numericSearch.body.data.items[0].amount).toBe(200);
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
        amount: 750,
        notes: "Team lunch"
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.amount).toBe(750);
    expect(response.body.data.notes).toBe("Team lunch");
  });

  test("should delete an expense", async () => {
    const response = await request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });

  test("should not allow another user to access the expense", async () => {
    const secondUser = await request(app)
      .post("/api/auth/register")
      .send({
        email: `expense-owner-${Date.now()}@example.com`,
        password: "Test@123456"
      });

    const createResponse = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${secondUser.body.data.token}`)
      .send({
        amount: 200,
        category: "Food",
        description: "Second user's expense",
        date: new Date().toISOString()
      });

    const foreignExpenseId = createResponse.body.data._id;

    const response = await request(app)
      .get(`/api/expenses/${foreignExpenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  });
});