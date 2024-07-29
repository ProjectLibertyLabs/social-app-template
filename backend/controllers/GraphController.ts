import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import { GraphService } from '../services/GraphService';
import { HttpError } from '../types/HttpError';
import { validateAuthToken } from '../services/TokenAuth';
import logger from '../logger';
import { GraphWebhookService } from '../services/GraphWebhookService';

export class GraphController extends BaseController {
  constructor(app: Express) {
    super(app, '/graph');
  }

  protected initializeRoutes(): void {
    this.router.get('/:msaId/following', validateAuthToken, this.getFollowing.bind(this));
    this.router.post('/:msaId/follow', validateAuthToken, this.postFollow.bind(this));
    this.router.post('/:msaId/unfollow', validateAuthToken, this.postUnfollow.bind(this));
    this.router.get('/operations/:refId', validateAuthToken, this.getGraphOperationStatus.bind(this));
  }

  /**
   * Retrieves the list of users that a given user is following.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the list of users that the given user is following.
   */
  public async getFollowing(req: Request, res: Response) {
    const msaId = req.params?.msaId;

    if (!msaId) {
      return res.status(HttpStatusCode.NotFound).send();
    }

    try {
      const follows = await GraphService.getInstance().then((service) => service.getPublicFollows(msaId));
      return res.status(HttpStatusCode.Ok).send(follows);
    } catch (err) {
      logger.error({ err }, 'Error getting user follows');
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }

      return res.status(HttpStatusCode.InternalServerError).send();
    }
  }

  public async postFollow(req: Request, res: Response) {
    const msaId = req.headers?.['msaId'];

    if (!msaId || typeof msaId !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send();
    }

    const msaToFollow = req.params.msaId;
    if (!msaToFollow || typeof msaToFollow !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send();
    }

    try {
      const referenceId = await GraphService.getInstance().then((service) =>
        service.postFollow(msaId, parseInt(msaToFollow))
      );
      return res.status(HttpStatusCode.Created).send({ referenceId });
    } catch (err: any) {
      logger.error({ err }, 'Error changing user graph: follow');
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }

      return res.status(HttpStatusCode.InternalServerError).send(err.message);
    }
  }

  public async postUnfollow(req: Request, res: Response) {
    const msaId = req.headers?.['msaId'];
    if (!msaId || typeof msaId !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send();
    }

    const msaToUnfollow = req.params.msaId;
    if (!msaToUnfollow || typeof msaToUnfollow !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send();
    }

    try {
      const referenceId = await GraphService.getInstance().then((service) =>
        service.postUnfollow(msaId, parseInt(msaToUnfollow))
      );

      return res.status(HttpStatusCode.Created).send({ referenceId });
    } catch (err: any) {
      logger.error({ err }, 'Error changing user graph: unfollow');
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }
      return res.status(HttpStatusCode.InternalServerError).send(err.message);
    }
  }

  public getGraphOperationStatus(req: Request, res: Response) {
    const refId = req.params?.refId;
    if (!refId || typeof refId !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send();
    }

    try {
      const status = GraphWebhookService.getOperationStatusByRefId(refId);
      if (!status) {
        return res.status(HttpStatusCode.NotFound).send();
      }

      return res.status(HttpStatusCode.Ok).send({ referenceId: refId, status }).end();
    } catch (err: any) {
      logger.error({ err }, 'Error getting graph operation status');
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message).end();
      }
      return res.status(HttpStatusCode.InternalServerError).send(err.message).end();
    }
  }
}
