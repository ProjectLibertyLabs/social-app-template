// Config first
import "dotenv/config";
// Augment Polkadot Types First
import "@frequency-chain/api-augment";
import * as openapiBackend from "openapi-backend";
import Express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import type { Request } from "openapi-backend";

import * as auth from "./handlers/auth.js";
import * as content from "./handlers/content.js";
import * as graph from "./handlers/graph.js";
import * as profile from "./handlers/profile.js";

import openapiJson from "./openapi.json" assert { type: "json" };
import { getApi } from "./services/frequency.js";
import { getAccountFromAuth } from "./services/auth.js";

// Support BigInt JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = Express();
app.use(Express.json());

// TODO: See if we want to generate the OpenAPI doc instead of spec first
const api = new openapiBackend.OpenAPIBackend({
  definition: "openapi.json",
  handlers: {
    ...auth,
    ...content,
    ...graph,
    ...profile,

    validationFail: async (c, req: Express.Request, res: Express.Response) =>
      res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req: Express.Request, res: Express.Response) =>
      res.status(404).json({ err: "not found" }),
  },
});

api.init();

// cors
app.use(cors());

// logging
app.use(morgan("combined"));

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiJson));

// Simple Token Auth
api.registerSecurityHandler("tokenAuth", async (c) => {
  if (typeof c.request.headers.authorization !== "string") return false;
  const token = c.request.headers.authorization.split(" ")[1];
  const account = await getAccountFromAuth(token);

  if (account === null) return false;

  // truthy return values are interpreted as auth success
  // you can also add any auth information to the return value
  return account;
});

api.register("unauthorizedHandler", (_c, _req, res) => {
  return res.status(401).send();
});

// use as express middleware
app.use((req, res) => api.handleRequest(req as Request, req, res));

const port = parseInt(process.env.PORT || "0") || "5005";
// start server
app.listen(port, () => {
  getApi().catch((e) => {
    console.error("Error connecting to Frequency Node!!", e.message);
  });
  console.info(
    `api listening at http://localhost:${port}\nOpenAPI Docs at http://localhost:${port}/docs`,
  );
});
