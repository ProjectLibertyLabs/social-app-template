import { spawn, ChildProcess } from "child_process";
import axios, { AxiosInstance } from "axios";
import waitOn from "wait-on";

jest.setTimeout(15000);

describe("express-ts example", () => {
  let start: ChildProcess;
  let client: AxiosInstance;

  beforeAll(async () => {
    client = axios.create({
      baseURL: "http://localhost:9000",
      validateStatus: () => true,
    });
    start = spawn("npm", ["start"], {
      cwd: __dirname,
      detached: true,
      stdio: "inherit",
    });
    await waitOn({ resources: ["tcp:localhost:9000"] });
  });

  afterAll(() => process.kill(-start.pid!));

  test("GET /v1/auth/challenge returns 200 with matched operation", async () => {
    const res = await client.get("/v1/auth/challenge");
    expect(res.status).toBe(200);
  });

  test("GET /unknown returns 404", async () => {
    const res = await client.get("/unknown");
    expect(res.status).toBe(404);
    expect(res.data).toHaveProperty("err");
  });
});
