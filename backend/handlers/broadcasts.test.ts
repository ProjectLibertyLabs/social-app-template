import request from "supertest";
import { describe, expect, it, vi, MockedFunction, beforeEach } from "vitest";
import { app } from "../index.js";
import * as auth from "../../services/auth.js";
import { BroadcastService } from "../services/BroadcastService.js";

vi.mock("../../services/BroadcastService.js");
vi.mock("../../services/auth.js");
describe("POST /broadcasts", () => {
  beforeEach(() => {
    (
      auth.getAccountFromAuth as MockedFunction<typeof auth.getAccountFromAuth>
    ).mockResolvedValueOnce({
      publicKey: "publicKey",
      msaId: "msaId",
    });
  });

  it("returns 202 with matched operation", async () => {
    BroadcastService.create = vi.fn().mockResolvedValueOnce({
      content: "hello world",
      published: "2021-09-01T00:00:00Z",
    });

    const content = {
      content: "hello world",
      assets: ["asset1"],
    };

    const res = await request(app)
      .post("/v2/broadcasts")
      .auth("username", "password")
      .send(content)
      .set("Accept", "application/json");

    expect(res.status).toBe(202);
    expect(res.body).toEqual({
      content: "hello world",
      published: "2021-09-01T00:00:00Z",
    });
  });

  it("returns 503 when getting an error from content-publisher", async () => {
    BroadcastService.create = vi.fn().mockRejectedValueOnce("err");
    const content = {
      content: "hello world",
      assets: ["asset1"],
    };

    const res = await request(app)
      .post("/v2/broadcasts")
      .auth("username", "password")
      .send(content)
      .set("Accept", "application/json");

    expect(res.status).toBe(503);
  });

  it("returns 400 when missing fields property", async () => {
    const res = await request(app)
      .post("/v2/broadcasts")
      .auth("username", "password")
      .send({})
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("err");
    expect(res.body.err[0].message).toMatch(/must have required property/);
  });

  it("returns 400 when invalid content-type", async () => {
    const res = await request(app)
      .post("/v2/broadcasts")
      .auth("username", "password")
      .send({})
      .set("Accept", "text/html");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("err");
    expect(res.body.err[0].message).toMatch(/must have required property/);
  });
});
