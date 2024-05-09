import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import { GraphService } from '../services/GraphService';
import { HttpError } from '../types/HttpError';
import { validateAuthToken, validateMsaAuth } from '../services/TokenAuth';

export class GraphController extends BaseController {
  constructor(app: Express) {
    super(app, '/graph');
  }

  protected initializeRoutes(): void {
    this.router.get('/:dsnpId/following', validateAuthToken, this.getFollowing.bind(this));
    this.router.post('/:dsnpId/follow', validateAuthToken, this.postFollow.bind(this));
    this.router.post('/:dsnpId/unfollow', validateAuthToken, this.postUnfollow.bind(this));
  }

  public async getFollowing(req: Request, res: Response) {
    const msaId = req.params?.dsnpId;

    if (!msaId) {
      return res.status(HttpStatusCode.NotFound).send();
    }

    try {
      const follows = await GraphService.instance().then((service) => service.getPublicFollows(msaId));
      return res.status(HttpStatusCode.Ok).send(follows);
    } catch (err) {
      console.error('Error getting user follows', err);
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

    const msaToFollow = req.params.dsnpId;
    if (!msaToFollow || typeof msaToFollow !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send();
    }

    try {
      await GraphService.instance().then((service) => service.follow(msaId, parseInt(msaToFollow)));
      return res.status(HttpStatusCode.Created).send();
    } catch (err: any) {
      console.error('Error changing user graph: follow', err);
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

    const msaToUnfollow = req.params.dsnpId;
    if (!msaToUnfollow || typeof msaToUnfollow !== 'string') {
      return res.status(HttpStatusCode.BadRequest).send();
    }

    try {
      await GraphService.instance().then((service) => service.unfollow(msaId, parseInt(msaToUnfollow)));

      return res.status(HttpStatusCode.Created).send();
    } catch (err: any) {
      console.error('Error changing user graph: unfollow', err);
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }
      return res.status(HttpStatusCode.InternalServerError).send(err.message);
    }
  }
}
