// Config first
import "dotenv/config";
// Augment Polkadot Types First
import "@frequency-chain/api-augment";
import * as openapiBackend from "openapi-backend";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import multer, { MulterError } from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import type { Request as OpenApiRequest } from "openapi-backend";

import * as assets from "./handlers/v2/assets.js";
import * as auth from "./handlers/auth.js";
import * as content from "./handlers/content.js";
import * as graph from "./handlers/graph.js";
import * as profile from "./handlers/profile.js";
import * as broadcasts from "./handlers/v2/broadcasts.js";

import openapiJson from "./openapi.json" assert { type: "json" };
import { getApi } from "./services/frequency.js";
import { getAccountFromAuth } from "./services/TokenAuth.js";
import * as Config from "./config/config.js";
import { AuthController } from "./controllers/AuthController.js";
import { ContentController } from "./controllers/ContentController.js";
import { GraphController } from "./controllers/GraphController.js";
import { ProfilesController } from "./controllers/ProfilesController.js";

// Support BigInt JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const DEFAULT_PORT = 3000;

Config.init(process.env);

const app = express();
app.use(express.json());

// TODO: See if we want to generate the OpenAPI doc instead of spec first
// const api = new openapiBackend.OpenAPIBackend({
//   definition: "openapi.json",
//   handlers: {
//     ...assets,
//     ...auth,
//     ...content,
//     ...broadcasts,
//     ...graph,
//     ...profile,

//     validationFail: async (c, req: Request, res: Response) => {
//       return res.status(400).json({ err: c.validation.errors });
//     },
//     notFound: async (c, req: Request, res: Response) =>
//       res.status(404).json({ err: "not found" }),
//   },
// });

// api.register("unauthorizedHandler", (_c, _req, res) => {
//   return res.status(401).send();
// });

// // Simple Token Auth
// api.registerSecurityHandler("tokenAuth", async (c) => {
//   if (typeof c.request.headers.authorization !== "string") return false;
//   const token = c.request.headers.authorization.split(" ")[1];
//   const account = await getAccountFromAuth(token);

//   if (account === null) return false;

//   // truthy return values are interpreted as auth success
//   // you can also add any auth information to the return value
//   return account;
// });

// api.init();

// cors
app.use(cors());

// logging
app.use(morgan("combined"));

const _controllers = [
  new AuthController(app),
  new ContentController(app),
  new GraphController(app),
  new ProfilesController(app),
];

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiJson));

app.post(
  "/v2/assets",
  upload.array("files"),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    next();
  },
);

// app.use((req: Request, res: Response) => {
//   return api.handleRequest(req as OpenApiRequest, req, res);
// });

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  if (err instanceof MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (
    err.message &&
    err.message.includes("Multipart: Boundary not found")
  ) {
    return res
      .status(400)
      .json({ error: "Invalid multipart/form-data header or boundary" });
  }

  return res.status(500).json({ error: "An internal server error occurred." });
});

let port = parseInt(process.env.API_PORT || DEFAULT_PORT.toString());
if (isNaN(port)) {
  port = DEFAULT_PORT;
}
if (process.env.NODE_ENV != "test") {
  // start server
  app.listen(port, () => {
    getApi().catch((e) => {
      console.error("Error connecting to Frequency Node!!", e.message);
    });
    console.info(
      `api listening at http://localhost:${port}\nOpenAPI Docs at http://localhost:${port}/docs`,
    );
  });
}

export { app };
