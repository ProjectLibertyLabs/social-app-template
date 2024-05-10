// Config first
import 'dotenv/config';
// Augment Polkadot Types First
import '@frequency-chain/api-augment';
import express, { Request, Response, NextFunction } from 'express';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import openapiJson from './openapi.json' assert { type: 'json' };
import { getApi } from './services/frequency.js';
import * as Config from './config/config.js';
import { AuthController } from './controllers/AuthController.js';
import { ContentController } from './controllers/ContentController.js';
import { GraphController } from './controllers/GraphController.js';
import { ProfilesController } from './controllers/ProfilesController.js';
import { AssestsController } from './controllers/AssetsController';
import { BroadcastsController } from './controllers/BroadcastsController';
import { MulterError } from 'multer';
import logger from './logger';
import { WebhookController } from './controllers/WebhookController';

// Support BigInt JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

Config.init(process.env);

const publicApp = express();
publicApp.use(express.json());
publicApp.use(cors());
publicApp.use(pinoHttp({ logger }));

const privateApp = express();
privateApp.use(express.json());
privateApp.use(cors());
privateApp.use(pinoHttp({ logger }));

const _controllers = [
  new AuthController(publicApp),
  new AssestsController(publicApp),
  new BroadcastsController(publicApp),
  new ContentController(publicApp),
  new GraphController(publicApp),
  new ProfilesController(publicApp),

  // private (backend) webhook controllers
  new WebhookController(privateApp),
];

// Swagger UI
publicApp.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiJson));

publicApp.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  if (err instanceof MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err.message && err.message.includes('Multipart: Boundary not found')) {
    return res.status(400).json({ error: 'Invalid multipart/form-data header or boundary' });
  }

  return res.status(500).json({ error: 'An internal server error occurred.' });
});

const { port, privatePort, privateHost } = Config.instance();
if (process.env.NODE_ENV != 'test') {
  // start server
  publicApp.listen(port, () => {
    getApi().catch((e) => {
      logger.error('Error connecting to Frequency Node!!', e.message);
    });
    logger.info('api listening at http://localhost:%d', port);
    logger.info('OpenAPI Docs at http://localhost:%d/docs', port);
  });

  if (privateHost) {
    privateApp.listen(privatePort, privateHost, () =>
      logger.info('private api listening at http://%s:%d', privateHost, privatePort)
    );
  } else {
    privateApp.listen(privatePort, () => logger.info('private api listening at http://localhost:%d', privatePort));
  }
}

export { publicApp as app, privateApp };
