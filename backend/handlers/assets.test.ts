import request from "supertest";
import axios from "axios";
import { it, describe, expect, MockedFunction, vi } from "vitest";
import { app } from "../index.js";
import { ParsedFile } from "../types/backend.js";

vi.mock("axios");

describe("GET /v2/assets/", () => {
  it("returns 202 with matched operation", async () => {
    const responseData = ["asset1"];
    (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
      data: responseData,
      status: 202,
    });
    const res = await request(app)
      .post("/v2/assets")
      .attach("files", Buffer.from("hello world", "utf8"), "file1.txt");

    expect(res.status).toBe(202);
    expect(res.body).toEqual(["asset1"]);
  });

  it("returns 503 when getting an error from content-publisher", async () => {
    (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
      data: [],
      status: 400,
    });
    const res = await request(app)
      .post("/v2/assets")
      .attach("files", Buffer.from("hello world", "utf8"), "file1.txt");

    expect(res.status).toBe(503);
  });

  it("returns 400 when missing fields property", async () => {
    const res = await request(app)
      .post("/v2/assets")
      .attach("file", Buffer.from("hello world", "utf8"), "file1.txt");

    expect(res.status).toBe(400);
    expect(JSON.parse(res.text).error).toEqual("Unexpected field");
  });

  it("returns 400 when invalid content-type", async () => {
    const files: ParsedFile = {
      name: "file1",
      file: Buffer.from("hello world", "utf8"),
      filename: "file1.txt",
      mimetype: "text/plain",
    };

    const formData = new FormData();
    const fileBlob = new Blob([files.file]);
    formData.append("file1", fileBlob);

    const responseData = ["asset1"];
    (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
      data: responseData,
      status: 202,
    });
    const res = await request(app)
      .post("/v2/assets")
      .set("Content-type", "multipart/form-data");

    expect(res.status).toBe(400);
    expect(JSON.parse(res.text).error).toEqual(
      "Invalid multipart/form-data header or boundary",
    );
  });
});