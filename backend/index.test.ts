import request from "supertest";
import { describe, expect, test } from "vitest";
import app from "./index.js";

describe("API", () => {
  test("GET /v1/auth/challenge returns 200 with matched operation", async () => {
    const res = await request(app).get("/v1/auth/challenge");

    expect(res.status).toBe(404);
  });

  test("GET /unknown returns 404", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
    expect(JSON.parse(res.text)).toHaveProperty("err");
  });
});
