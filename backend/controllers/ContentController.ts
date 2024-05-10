import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import * as ContentService from '../services/ContentService';
import { HttpError } from '../types/HttpError';
import { RequestAccount, validateAuthToken, validateMsaAuth } from '../services/TokenAuth';

export class ContentController extends BaseController {
  constructor(app: Express) {
    super(app, '/v1/content');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get('/feed', validateAuthToken, validateMsaAuth, this.getFeed.bind(this));
    this.router.get('/discover', validateAuthToken, validateMsaAuth, this.getDiscover.bind(this));
    this.router.get('/:dsnpId', this.getContent.bind(this));
    this.router.post('/create', validateAuthToken, validateMsaAuth, this.postContentCreate.bind(this));

    this.router.get(
      '/:dsnpId/:contentHash',
      validateAuthToken,
      validateMsaAuth,
      this.getSpecificUserContent.bind(this)
    );
    this.router.put(
      '/:contentType/:contentHash',
      validateAuthToken,
      validateMsaAuth,
      this.putSpecificContentType.bind(this)
    );
  }

  public async getContent(req: Request, res: Response) {
    const { dsnpId: msaId } = req.params;
    const { newestBlockNumber: endStr, oldestBlockNumber: startStr } = req.query;
    res.status(HttpStatusCode.Ok).send();
  }

  public async getFeed(req: Request, res: Response) {
    const { newestBlockNumber: endStr, oldestBlockNumber: startStr } = req.query;
    const { msaId } = req.headers as Required<RequestAccount>;

    try {
      const oldestBlockNumber = startStr && typeof startStr === 'string' ? parseInt(startStr) : undefined;
      const newestBlockNumber = endStr && typeof endStr === 'string' ? parseInt(endStr) : undefined;
      const response = await ContentService.getUserFeed(msaId, {
        newestBlockNumber,
        oldestBlockNumber,
      });
      res.status(HttpStatusCode.Ok).send(response).end();
    } catch (err: any) {
      console.error('Error: unable to discover content: ', err);
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
    try {
      const oldestBlockNumber = startStr && typeof startStr === 'string' ? parseInt(startStr) : undefined;
      const newestBlockNumber = endStr && typeof endStr === 'string' ? parseInt(endStr) : undefined;
      const response = await ContentService.getDiscover({
        newestBlockNumber,
        oldestBlockNumber,
      });
      console.dir(response);

      res.status(HttpStatusCode.Ok).send(response).end();
    } catch (err: any) {
      console.error('Error: unable to discover content: ', err);
      if (err instanceof HttpError) {
        return res
          .status(err.code)
          .send(err.message || 'Caught error getting discovered content')
          .end();
      }

      return res.status(HttpStatusCode.InternalServerError).send(err.message).end();
    }
  }

  public async postContentCreate(req: Request, res: Response) {
    const { msaId } = req.headers;
    if (!msaId || typeof msaId !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send('Missing/invalid MSA ID');
    }

    try {
      const response = await ContentService.createBroadcast(msaId, req);
    } catch (err: any) {
      console.error('Error creating a post: ', err);
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }

      return res.status(HttpStatusCode.InternalServerError).send(err.message);
    }
  }

  public getSpecificUserContent(req: Request, res: Response) {
    const { dsnpId, contentHash } = req.params;
    if (!dsnpId || typeof dsnpId !== 'string' || (contentHash && typeof contentHash !== 'string')) {
      return res.status(HttpStatusCode.BadRequest).send().end();
    }

    // Stub
    res
      .status(HttpStatusCode.Ok)
      .send({
        fromId: dsnpId,
        contentHash: contentHash || '0xabcd',
        content: '',
        timestamp: new Date().toISOString(),
        replies: [],
      })
      .end();
  }

  public putSpecificContentType() {}
}
