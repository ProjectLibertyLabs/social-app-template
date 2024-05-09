// Config first
import "dotenv/config";
// Augment Polkadot Types First
import "@frequency-chain/api-augment";
import express, { Request, Response, NextFunction } from "express";
import pinoHttp from 'pino-http';
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import openapiJson from "./openapi.json" assert { type: "json" };
import { getApi } from "./services/frequency.js";
import * as Config from "./config/config.js";
import { AuthController } from "./controllers/AuthController.js";
import { ContentController } from "./controllers/ContentController.js";
import { GraphController } from "./controllers/GraphController.js";
import { ProfilesController } from "./controllers/ProfilesController.js";
import { AssestsController } from "./controllers/AssetsController";
import { BroadcastsController } from "./controllers/BroadcastsController";
import { MulterError } from "multer";
import logger from './logger';

// Support BigInt JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const DEFAULT_PORT = 3000;

Config.init(process.env);

const app = express();
app.use(express.json());

// cors
app.use(cors());

app.use(pinoHttp({ logger }));

const _controllers = [
  new AuthController(app),
  new AssestsController(app),
  new BroadcastsController(app),
  new ContentController(app),
  new GraphController(app),
  new ProfilesController(app),
];

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiJson));

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
