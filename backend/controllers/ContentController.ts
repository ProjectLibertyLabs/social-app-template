import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import * as ContentService from '../services/ContentService';
import { HttpError } from '../types/HttpError';
import { RequestAccount, validateAuthToken, validateMsaAuth } from '../services/TokenAuth';
import logger from '../logger';

export class ContentController extends BaseController {
  constructor(app: Express) {
    super(app, '/content');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get('/feed', validateAuthToken, validateMsaAuth, this.getFeed.bind(this));
    this.router.get('/discover', this.getDiscover.bind(this));
    this.router.get('/:msaId', this.getContent.bind(this));
    this.router.get('/:msaId/:contentHash', validateAuthToken, validateMsaAuth, this.getSpecificUserContent.bind(this));
    this.router.put(
      '/:contentType/:contentHash',
      validateAuthToken,
      validateMsaAuth,
      this.putSpecificContentType.bind(this)
    );
  }

  public async getContent(req: Request, res: Response) {
    const { newestBlockNumber: endStr, oldestBlockNumber: startStr } = req.query;
    const { msaId } = req.params;

    try {
      const oldestBlockNumber = startStr && typeof startStr === 'string' ? parseInt(startStr) : undefined;
      const newestBlockNumber = endStr && typeof endStr === 'string' ? parseInt(endStr) : undefined;
      const response = await ContentService.getOwnContent(msaId, {
        newestBlockNumber,
        oldestBlockNumber,
      });
      res.status(HttpStatusCode.Ok).send(response).end();
    } catch (err: any) {
      logger.error({ err }, 'Error: unable to get own content: ');
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message || 'Caught error getting feed for current user');
      }

      return res
        .status(HttpStatusCode.InternalServerError)
        .send(err.message || 'Caught error getting feed')
        .end();
    }
  }

  public async getFeed(req: Request, res: Response) {
    const { newestBlockNumber: endStr, oldestBlockNumber: startStr } = req.query;
    const { msaId } = req.headers as Required<RequestAccount>;

    try {
      const oldestBlockNumber = startStr && typeof startStr === 'string' ? parseInt(startStr) : undefined;
      const newestBlockNumber = endStr && typeof endStr === 'string' ? parseInt(endStr) : undefined;
      const response = await ContentService.getFollowingContent(msaId, {
        newestBlockNumber,
        oldestBlockNumber,
      });
      res.status(HttpStatusCode.Ok).send(response).end();
    } catch (err: any) {
      logger.error({ err }, 'Error: unable to discover content: ');
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message || 'Caught error getting feed for current user');
      }

      return res
        .status(HttpStatusCode.InternalServerError)
        .send(err.message || 'Caught error getting feed')
        .end();
    }
  }

  public async getDiscover(req: Request, res: Response) {
    const { newestBlockNumber: endStr, oldestBlockNumber: startStr } = req.query;
    const { msaId } = req.headers as Required<RequestAccount>;
    try {
      const oldestBlockNumber = startStr && typeof startStr === 'string' ? parseInt(startStr) : undefined;
      const newestBlockNumber = endStr && typeof endStr === 'string' ? parseInt(endStr) : undefined;
      const response = await ContentService.getDiscover(msaId, {
        newestBlockNumber,
        oldestBlockNumber,
      });

      res.status(HttpStatusCode.Ok).send(response).end();
    } catch (err: any) {
      logger.error({ err }, 'Error: unable to discover content: ');
      if (err instanceof HttpError) {
        return res
          .status(err.code)
          .send(err.message || 'Caught error getting discovered content')
          .end();
      }

      return res.status(HttpStatusCode.InternalServerError).send(err.message).end();
    }
  }

  public async getSpecificUserContent(req: Request, res: Response) {
    const { msaId, contentHash } = req.params;
    if (!msaId || typeof msaId !== 'string' || (contentHash && typeof contentHash !== 'string')) {
      return res.status(HttpStatusCode.BadRequest).send().end();
    }

    try {
      const content = await ContentService.getContent(msaId, contentHash);
      return res.status(HttpStatusCode.Found).send(content).end();
    } catch (err: any) {
      logger.error({ err, msaId, contentHash }, 'Error fetching content');
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }

      return res.status(HttpStatusCode.InternalServerError).send(err.message).end();
    }
  }

  public putSpecificContentType() {}

  // public getEvents(req: Request, res: Response) {
  //   // SSE endpoint to subscribe to events
  //   logger.warn(req, 'getEvents');
  //   res.setHeader('Content-Type', 'text/event-stream');
  //   res.setHeader('Cache-Control', 'no-cache');
  //   res.setHeader('Connection', 'keep-alive');

  //   const clientId = Date.now().toString();
  //   sseManager.addClient(clientId, res);

  //   // Send a test message immediately
  //   logger.debug('getEvents');
  //   const sendEvent = (data: "testing SSE") => {
  //     res.write(`data: ${JSON.stringify(data)}\n\n`);
  //   };

  //   sseManager.broadcast('announcement', sendEvent);

  //   // // Example: Send an event every 10 seconds
  //   // const intervalId = setInterval(() => {
  //   //   const eventData = { time: new Date().toISOString() };
  //   //   res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  //   // }, 3000);

  //   // Handle client disconnection
  //   req.on('close', () => {
  //     // clearInterval(intervalId);
  //     sseManager.removeClient(clientId);
  //     res.end();
  //   });
  // }
}
